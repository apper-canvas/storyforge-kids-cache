const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AudioService {
  constructor() {
    this.recordings = new Map();
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  async startRecording() {
    await delay(100);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.start();
      return { success: true, recording: true };
    } catch (error) {
      throw new Error('Failed to start recording: ' + error.message);
    }
  }

  async stopRecording() {
    await delay(100);
    
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const recordingId = Date.now().toString();
        
        this.recordings.set(recordingId, {
          id: recordingId,
          url: audioUrl,
          blob: audioBlob,
          createdAt: new Date().toISOString()
        });

        // Stop all tracks
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        
        resolve({
          id: recordingId,
          url: audioUrl,
          success: true
        });
      };

      this.mediaRecorder.stop();
    });
  }

  async getRecording(id) {
    await delay(50);
    const recording = this.recordings.get(id);
    if (!recording) {
      throw new Error('Recording not found');
    }
    return { ...recording };
  }

  async deleteRecording(id) {
    await delay(100);
    const recording = this.recordings.get(id);
    if (recording) {
      URL.revokeObjectURL(recording.url);
      this.recordings.delete(id);
    }
    return { success: true };
  }

  async getAllRecordings() {
    await delay(150);
    return Array.from(this.recordings.values());
  }

  isRecording() {
    return this.mediaRecorder && this.mediaRecorder.state === 'recording';
  }

  // Simulate audio playback
  async playAudio(audioUrl) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      
      audio.onended = () => resolve({ success: true });
      audio.onerror = () => reject(new Error('Failed to play audio'));
      
      audio.play().catch(reject);
    });
  }
}

export default new AudioService();