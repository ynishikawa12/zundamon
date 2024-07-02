import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import { SERVER_URL, VOICES_URL } from "../consts/url";
import { MAX_VOICE_TEXT_LENGTH } from "../consts/voice";
import { useParams } from "react-router-dom";
import { Buffer } from "buffer";


type Voice = {
  text: string;
  voice: Blob;
  createdAt: string;
};

export function Voice() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [voiceText, setVoiceText] = useState<string>();
  const params = useParams();

  const handlePostRequest = useCallback(() => {
    const url = SERVER_URL + VOICES_URL + "/" + params.id
    const textObj = { text: voiceText }
    axios.post(url, textObj, {})
    .then((response) => {
      const buffer = Buffer.from(response.data.voice, "base64");
      const blob = new Blob([buffer], {type: "audio/wav"});
      console.log(response.data)
      const voice: Voice = {
        text: response.data.text,
        voice: blob,
        createdAt: response.data.createdAt.slice(0, 19).replace("T", " "),
      }

      setVoices([...voices, voice]);
    })
    .catch((error) => {
      console.log(error);
      alert("音声の作成に失敗しました");
    });
  }, [voiceText])

  const handleVoiceText = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setVoiceText(e.target.value), [voiceText]);

  const voicesJsx = useMemo(() => {
    const jsx = voices.map((voice) => {
      const blobUrl = URL.createObjectURL(voice.voice);
      console.log(voice)
      return (
        <div>
          <audio src={blobUrl}></audio>
          <span>{voice.text}</span>
          <span>{voice.createdAt}</span>
          <audio
            controls
            src={blobUrl}>
          </audio>
          <button>削除</button>
        </div>
      );
    });
    
    return jsx
  }, [voices]);

  console.log(voicesJsx)
  return (
    <>
      セリフ：<textarea maxLength={MAX_VOICE_TEXT_LENGTH} value={voiceText} onChange={handleVoiceText}></textarea>
      <button onClick={handlePostRequest}>音声合成</button>
      {voicesJsx}
    </>
  );
}
