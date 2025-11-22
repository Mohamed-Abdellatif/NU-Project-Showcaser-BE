import { supabase } from '../config/supabase';

export interface UploadResult {
  url: string;
}

export interface MultipleUploadResult {
  urls: string[];
}

export const uploadFile = async (
  file: Express.Multer.File,
  folder: string
): Promise<UploadResult> => {
  if (!file) {
    throw new Error('No file provided');
  }

  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.originalname}`;
  const filePath = `${folder}/${fileName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('uploads')
    .getPublicUrl(data.path);

  if (!urlData?.publicUrl) {
    throw new Error('Failed to generate public URL');
  }

  return { url: urlData.publicUrl };
};

export const uploadMultipleFiles = async (
  files: Express.Multer.File[],
  folder: string
): Promise<MultipleUploadResult> => {
  if (!files || files.length === 0) {
    throw new Error('No files provided');
  }

  const uploadPromises = files.map((file) => uploadFile(file, folder));
  const results = await Promise.all(uploadPromises);

  return {
    urls: results.map((result) => result.url),
  };
};

