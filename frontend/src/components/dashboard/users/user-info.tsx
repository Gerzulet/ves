'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '@/contexts/user-context';
import { User } from '@/types/user';
// import { uploadFile } from '@/services/s3.services';

interface UserInfoProps {
  user: User;
  isEdit: boolean;  
}

export function UserInfo({ user, isEdit }: UserInfoProps): React.JSX.Element {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      photo: user?.photo || '',  // Usar la foto del usuario o dejar vacío
    }
  });

  const [previewImage, setPreviewImage] = useState<string | undefined>(user?.photo || '');

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const formData = new FormData();
      formData.append('file', files[0]);
  
      // Send the file to your Laravel backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}'/users/upload`, {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      console.log("Image URL:", data.url); // Use or store the returned S3 URL
    }
  };
  

  const handleAddImage = () => {
    setPreviewImage('/assets/placeholder.png');
  };

  useEffect(() => {
    // Si estamos en modo creación (new), resetear los campos a vacío
    if (!isEdit) {
      reset({ photo: '' });
      setPreviewImage('/assets/placeholder.png'); 
    } else {
      setPreviewImage(user?.photo || '/assets/avatar.png'); // Usar la imagen actual del usuario
    }
  }, [reset, isEdit, user]);

  return (
    <Card>
      <form onSubmit={handleSubmit((data) => console.log('Imagen cargada:', data))}>
        <CardContent>
          <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <div>
              <Avatar src={previewImage || '/assets/avatar.png'} sx={{ height: '80px', width: '80px' }} />
            </div>
            <Stack spacing={1} sx={{ textAlign: 'center' }}>
              <Typography variant="h5">{user?.name || 'Nombre no disponible'}</Typography>
              <Typography color="text.secondary" variant="body2">
                {user?.role || 'Rol no definido'}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {user?.email || 'Email no disponible'}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
        <Divider />
        <CardActions>
          <Controller
            name="photo"
            control={control}
            render={({ field }) => (
              <Button fullWidth variant="text" component="label" onClick={handleAddImage}>
                Cargar Imagen
                <input hidden accept="image/*" type="file" onChange={(e) => {
                  field.onChange(e.target.files); // Actualizar imagen en el form
                  handleImageChange(e);           // Manejar vista previa
                }} />
              </Button>
            )}
          />
        </CardActions>
      </form>
    </Card>
  );
}
