import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Avatar, IconButton, Dialog, DialogContent, DialogTitle } from '@mui/material';
import Button from '@mui/material/Button';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import CloseIcon from '@mui/icons-material/Close';

export default function CameraCapture({ onCapture, defaultPhoto, onRemove }) {
  const webcamRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (defaultPhoto) {
      setPhotoPreview(defaultPhoto);
    }
  }, [defaultPhoto]);

  const handleAvatarClick = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const handleCapture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setPhotoPreview(imageSrc); // base64
    onCapture(imageSrc);      // envia pro pai
    setOpen(false);
  };

  const renderAvatar = () => {
    if (!photoPreview) return null;

    const isBase64 = photoPreview.startsWith('data:image');

    return (
      <Avatar
        src={isBase64 ? photoPreview : `${baseUrl}${photoPreview}`}
        alt="Foto do cliente"
        sx={{
          borderRadius: '16px',
          width: 150,
          height: 150,
          border: '4px solid #00AB55',
        }}
      />
    );
  };

  return (
    <>
      {!photoPreview ? (
        <IconButton sx={{ borderRadius: '16px' }} onClick={handleAvatarClick}>
          <Avatar
            sx={{ width: 150, height: 150, bgcolor: '#E0E0E0', borderRadius: '16px' }}
          >
            <AccountCircleIcon sx={{ fontSize: 60, color: '#9E9E9E' }} />
          </Avatar>
        </IconButton>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          marginBottom: 24,
          flexWrap: 'wrap'
        }}>
          {renderAvatar()}
          <Button
            sx={{
              borderColor: '#FF5B5B',
              color: '#FF5B5B',

              '&:hover': {
                backgroundColor: 'rgba(255, 91, 91, 0.1)',
                borderColor: '#FF5B5B',
              },
            }}
            startIcon={<DeleteSweepOutlinedIcon />}
            variant="outlined"
            size='large'
            onClick={() => {
              setPhotoPreview(null);   // remove a imagem da visualização no CameraCapture
              if (onRemove) {
                onRemove();     // chama o callback do EditCliente para resetar estados
              }
            }}
          >
            Remover foto
          </Button>
        </div>
      )}

      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle sx={{ fontFamily: 'Nunito', fontWeight: 700 }}>
          Capturar foto
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 8, top: 8, color: '#717171' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ textAlign: 'center', position: 'relative' }}>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            width={500}
            videoConstraints={{ facingMode: 'user' }}
            style={{ borderRadius: 16 }}
          />
          <IconButton
            onClick={handleCapture}
            sx={{
              height: 60,
              width: 60,
              position: 'absolute',
              right: 10,
              bottom: 12,
              backgroundColor: '#00AB55',
              color: '#FFF',

              '&:hover': {
                backgroundColor: '#008C47'
              }
            }}
          >
            <CameraAltIcon />
          </IconButton>
        </DialogContent>
      </Dialog>
    </>
  );
}