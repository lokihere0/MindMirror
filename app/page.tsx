'use client';
import { useState } from 'react';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [emotion, setEmotion] = useState('');
  const [response, setResponse] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emotionKeywords: Record<string, string> = {
    happy: 'You seem joyful! Keep spreading that light ✨',
    sad: 'It’s okay to feel down sometimes. You’re not alone 💙',
    angry: 'Take a deep breath. Let’s try calming thoughts 🌿',
    anxious: 'Let’s ground ourselves. You are safe and capable 🫶',
    love: 'Such a beautiful feeling. Hold on to it ❤️',
  };

  const sendToMindMirror = async (message: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: message, mode: 'chat' }),
      });
      const data = await res.json();
      setResponse(data.reply || "MindMirror couldn't understand that. Try again.");
    } catch (err) {
      console.error('MindMirror error:', err);
      setResponse('Sorry, MindMirror had trouble responding.');
    }
    setLoading(false);
  };

  const analyzeEmotion = async () => {
    const lower = inputText.toLowerCase();
    const matched = Object.keys(emotionKeywords).find((keyword) =>
      lower.includes(keyword)
    );

    setEmotion(matched || 'unknown');

    const message = matched
      ? `The user is feeling "${matched}". Respond empathetically based on this message: "${inputText}"`
      : inputText;

    await sendToMindMirror(message);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen p-6 sm:p-10 bg-gradient-to-br from-[#dbeafe] to-[#f3e8ff] text-gray-800 font-sans">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">🪞 MindMirror</h1>

      <div className="flex flex-col gap-6 max-w-xl mx-auto">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="How are you feeling today?"
          className="p-4 border rounded resize-none h-32 bg-white shadow"
        />

        <button
          onClick={analyzeEmotion}
          className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
          disabled={loading}
        >
          {loading ? 'Reflecting...' : 'Reflect Emotion'}
        </button>

        {response && (
          <div className="bg-white rounded p-4 shadow">
            <h2 className="text-lg font-semibold">💬 MindMirror says:</h2>
            <p className="mt-2 whitespace-pre-line">{response}</p>
          </div>
        )}

        <div>
          <label className="block font-medium mb-2">🎨 Upload a mood image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Mood preview"
              className="w-full rounded shadow-md max-h-64 object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}
