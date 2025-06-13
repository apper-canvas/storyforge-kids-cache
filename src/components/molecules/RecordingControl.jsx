import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { audioService } from '@/services';

const RecordingControl = ({ onRecordingComplete, currentRecording }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      await audioService.startRecording();
      setIsRecording(true);
      setRecordingTime(0);
      toast.success('Recording started');
    } catch (error) {
      toast.error('Failed to start recording: ' + error.message);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioService.stopRecording();
      setIsRecording(false);
      setRecordingTime(0);
      onRecordingComplete && onRecordingComplete(result);
      toast.success('Recording saved');
    } catch (error) {
      toast.error('Failed to stop recording');
    }
  };

  const playRecording = async () => {
    if (!currentRecording) return;
    
    try {
      setIsPlaying(true);
      await audioService.playAudio(currentRecording);
      setIsPlaying(false);
    } catch (error) {
      setIsPlaying(false);
      toast.error('Failed to play recording');
    }
  };

  const deleteRecording = async () => {
    if (!currentRecording) return;
    
    try {
      await audioService.deleteRecording(currentRecording.id);
      onRecordingComplete && onRecordingComplete(null);
      toast.success('Recording deleted');
    } catch (error) {
      toast.error('Failed to delete recording');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-card border border-gray-200 p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-error recording-pulse' : 'bg-gray-300'}`} />
          <span className="text-sm font-medium text-gray-700">
            {isRecording ? 'Recording...' : 'Voice Recording'}
          </span>
        </div>
        
        {isRecording && (
          <span className="text-sm font-mono text-primary">
            {formatTime(recordingTime)}
          </span>
        )}
      </div>

      {/* Recording Controls */}
      <div className="flex items-center gap-2">
        {!isRecording ? (
          <Button
            variant="primary"
            size="sm"
            icon="Mic"
            onClick={startRecording}
          >
            Start Recording
          </Button>
        ) : (
          <Button
            variant="danger"
            size="sm"
            icon="Square"
            onClick={stopRecording}
          >
            Stop Recording
          </Button>
        )}

        {/* Playback Controls */}
        {currentRecording && !isRecording && (
          <>
            <Button
              variant="outline"
              size="sm"
              icon={isPlaying ? "Pause" : "Play"}
              onClick={playRecording}
              disabled={isPlaying}
            >
              {isPlaying ? 'Playing...' : 'Play'}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              icon="Trash2"
              onClick={deleteRecording}
              className="text-error hover:bg-error/10"
            >
              Delete
            </Button>
          </>
        )}
      </div>

      {/* Waveform Visualization */}
      {(isRecording || currentRecording) && (
        <div className="mt-4 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="flex items-center gap-1">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-primary rounded-full"
                animate={{
                  height: isRecording ? [4, 24, 4] : 12,
                  opacity: isRecording ? [0.3, 1, 0.3] : 0.6
                }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  repeat: isRecording ? Infinity : 0
                }}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RecordingControl;