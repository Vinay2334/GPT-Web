import { Box, Avatar, Typography, Button, IconButton } from '@mui/material';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContent';
import { red } from '@mui/material/colors';
import ChatItem from '../components/Chat/ChatItem';
import { IoMdSend, IoMdMic } from 'react-icons/io';
import { deleteUserChats, getUserChats, sendChatRequest } from '../helpers/api-communicators';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const [chatMessage, setChatMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState<string>(''); // Transcription text
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Start recording audio
  const handleStartRecording = () => {
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
          audioChunksRef.current = []; // Clear audio chunks after stopping
          const transcript = await transcribeAudio(audioBlob);
          setTranscriptionText(transcript); // Set transcription text here
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      }).catch((err) => {
        console.error('Error accessing the microphone: ', err);
        toast.error('Unable to access microphone.');
      });
    }
  };

  // Transcribe audio to text
  const transcribeAudio = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audioFile', audioBlob, 'recording.mp3');
    try {
      const response = await axios.post('http://localhost:5000/api/v1/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.transcript; // Return the transcript
    } catch (error) {
      console.error('Error during transcription:', error);
      toast.error('Failed to transcribe audio');
      return '';
    }
  };

  // Stop recording audio
  const handleStopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Handle form submission (sending chat message)
  const handleSubmit = async () => {
    const content = transcriptionText || inputRef.current?.value;  // Handle both transcription and manual typing
    if (content) {
      const newMessage: Message = { role: 'user', content };
      setChatMessages((prev) => [...prev, newMessage]);
      setTranscriptionText(''); // Clear transcription input

      try {
        const chatData = await sendChatRequest(content); // Send the message to the new API

        // Assuming the API returns a 'response' field from the assistant
        const newAssistantMessage: Message = { role: 'assistant', content: chatData.response };  
        setChatMessages((prev) => [...prev, newAssistantMessage]); // Add assistant's message
      } catch (error) {
        console.error(error);
        toast.error('Failed to get your message');
      }
    }
  };

  // Delete user chats
  const handleDeleteChats = async () => {
    try {
      toast.loading('Deleting Chats', { id: 'deletechats' });
      await deleteUserChats();
      setChatMessages([]); // Clear the chat
      toast.success('Your Chats have been deleted successfully', { id: 'deletechats' });
    } catch (error) {
      console.log(error);
      toast.error('Chat deletion unsuccessful', { id: 'deletechats' });
    }
  };

  // Load user chats on login
  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading('Loading Chats', { id: 'loadchats' });
      getUserChats().then((data) => {
        setChatMessages([...data.chats]);
        toast.success('Successfully loaded chats', { id: 'loadchats' });
      }).catch((err) => {
        console.log(err);
        toast.error('Failed to retrieve the older chats');
      });
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) {
      return navigate('/login');
    }
  }, [auth]);

  // Handle mic button click (start/stop recording)
  const handleMicButtonClick = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        width: '100%',
        height: '100%',
        mt: 3,
        gap: 3,
        position: 'relative',
      }}
    >
      {/* Left Sidebar */}
      <Box sx={{ display: { md: 'flex', xs: 'none', sm: 'none' }, flex: 0.2, flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            height: '78vh',
            bgcolor: 'rgb(17,29,39)',
            borderRadius: 5,
            flexDirection: 'column',
            mx: 3,
          }}
        >
          <Avatar sx={{ mx: 'auto', my: 2, bgcolor: 'white', color: 'black', fontWeight: 700 }}>
            {auth?.user?.name[0]}
          </Avatar>
          <Typography sx={{ mx: 'auto', fontFamily: 'work sans', pl: 5 }}>
            You are talking to your personalized smart chatbot
          </Typography>
          <Typography sx={{ mx: 'auto', fontFamily: 'work sans', my: 4, p: 3, pl: 5 }}>
            It would provide you personalized counseling according to your preference.
          </Typography>
          <Typography sx={{ mx: 'auto', fontFamily: 'work sans', my: 4, p: 3, pl: 5 }}>
            Avoid Sharing Personal Information with the Bot
          </Typography>
          <Button
            onClick={handleDeleteChats}
            sx={{
              width: '200px',
              my: 'auto',
              color: 'white',
              fontWeight: '700',
              borderRadius: 3,
              mx: 'auto',
              bgcolor: red[300],
              ':hover': { bgcolor: red.A400 },
            }}
          >
            Clear Conversation
          </Button>
        </Box>
      </Box>

      {/* Chat Window */}
      <Box
        sx={{
          display: 'flex',
          flex: { md: 0.8, xs: 1, sm: 1 },
          flexDirection: 'column',
          px: 3,
          position: 'relative',
        }}
      >
        <Typography
          sx={{
            fontSize: '40px',
            color: 'white',
            mb: 2,
            mx: 'auto',
          }}
        >
          Model- GPT 3.5 Turbo
        </Typography>

        <Box
          sx={{
            width: '100%',
            height: '60vh',
            borderRadius: 3,
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'scroll',
            overflowX: 'hidden',
            overflowY: 'auto',
            scrollBehavior: 'smooth',
          }}
        >
          {chatMessage.map((chat, index) => (
            <ChatItem content={chat.content} role={chat.role} key={index} />
          ))}
        </Box>

        {/* Typing Bar */}
        <div
          style={{
            width: '100%',
            padding: '20px',
            borderRadius: 8,
            backgroundColor: '#1a2632',
            display: 'flex',
            position: 'absolute',
            bottom: '0',
            left: '0',
            zIndex: '100',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={transcriptionText} // Bind transcriptionText to input value
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              padding: '10px',
              border: 'none',
              outline: 'none',
              color: 'white',
              fontSize: '20px',
            }}
            onChange={(e) => setTranscriptionText(e.target.value)} // Allow manual typing
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSubmit(); // Submit when Enter is pressed
              }
            }}
          />
          <IconButton
            onClick={handleMicButtonClick}
            sx={{
              color: 'white',
              backgroundColor: '#1a2632',
              marginLeft: '10px',
            }}
          >
            {isRecording ? (
              <span style={{ color: 'red' }}>Stop</span>
            ) : (
              <IoMdMic size={30} />
            )}
          </IconButton>
          <IconButton
            sx={{
              backgroundColor: '#1a2632',
              color: 'white',
              marginLeft: '10px',
            }}
            onClick={handleSubmit}
          >
            <IoMdSend size={30} />
          </IconButton>
        </div>
      </Box>
    </Box>
  );
};

export default Chat;
