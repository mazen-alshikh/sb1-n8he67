import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { uploadResource } from '../../lib/api';

const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['quran', 'hadith'], {
    required_error: 'Please select a resource type',
  }),
  file: z.instanceof(File, { message: 'Please select a file' }),
});

type ResourceForm = z.infer<typeof resourceSchema>;

export function ResourceUpload() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResourceForm>({
    resolver: zodResolver(resourceSchema),
  });

  const onSubmit = async (data: ResourceForm) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('type', data.type);
      formData.append('file', data.file);

      await uploadResource(formData);
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload resource');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Resource</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Title"
            {...register('title')}
            error={errors.title?.message}
          />

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Resource Type
            </label>
            <select
              {...register('type')}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
            >
              <option value="">Select type</option>
              <option value="quran">Quran</option>
              <option value="hadith">Hadith</option>
            </select>
            {errors.type?.message && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              File (JSON or CSV)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".json,.csv"
                      {...register('file')}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  JSON or CSV up to 10MB
                </p>
              </div>
            </div>
            {errors.file?.message && (
              <p className="text-sm text-red-500">{errors.file.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Uploading...' : 'Upload Resource'}
          </Button>
        </form>
      </div>
    </div>
  );
}