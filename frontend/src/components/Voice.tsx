import axios from "axios";
import { useCallback, useState } from "react";
import { SERVER_URL, VOICES_URL } from "../consts/url";
import { MAX_VOICE_TEXT_LENGTH } from "../consts/voice";
import { useParams } from "react-router-dom";
import { Buffer } from "buffer";

type Voice = {
  id: number;
  text: string;
  voice: Blob;
  created_at: string;
};

export function Voice() {
  const [testVoice, setTestVoice] = useState<Blob>();
  const [testVoiceUrl, setTestVoiceUrl] = useState("");
  const [voices, setVoices] = useState<Voice[]>([]);
  const [voiceText, setVoiceText] = useState<string>();
  const params = useParams();

  const handlePostRequest = useCallback(() => {
    const url = SERVER_URL + VOICES_URL + "/" + params.id
    const textObj = { text: voiceText }
    axios.post(url, textObj, {responseType: "blob"})
    .then((response) => {
      console.log("res", response.data);
      // Bufferに変換
      // const byteArray = Buffer.from(response.data.audio, 'base64')
      // console.log("byteArray",byteArray);
      // Blobに変換
      // const audioBlob = new Blob([byteArray], { type: 'audio/wav' })
      // console.log("audioBlob",audioBlob)
      // // URLに変換
      // const audioUrl = URL.createObjectURL(audioBlob)
      // console.log(audioUrl);
      setTestVoice(response.data as Blob)
    })
    .catch((error) => {
      console.error("音声データの取得に失敗しました:", error);
    });
  }, [voiceText])

  const handleVoiceText = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setVoiceText(e.target.value), [voiceText]);

  const voicesJsx = useCallback(() => {
    voices.map((voice) => {
      const blobUrl = URL.createObjectURL(voice.voice);
      return (
        <div>
          <audio src={blobUrl}></audio>
          <span>{voice.text}</span>
          <span>{voice.created_at}</span>
          <button>削除</button>
        </div>
      );
    });
  }, [voices]);

  return (
    <>
      セリフ：<textarea maxLength={MAX_VOICE_TEXT_LENGTH} value={voiceText} onChange={handleVoiceText}></textarea>
      <button onClick={handlePostRequest}>音声合成</button>
      {voicesJsx}
      <div>test: <audio
            controls
            src={testVoice ? window.URL.createObjectURL(testVoice) : undefined}>
          </audio>
      </div>
    </>
  );
}
