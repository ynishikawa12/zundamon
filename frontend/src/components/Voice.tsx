import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SERVER_URL, VOICES_URL } from "../consts/url";
import { MAX_VOICE_TEXT_LENGTH } from "../consts/voice";
import { useParams } from "react-router-dom";
import { Buffer } from "buffer";

type VoiceData = {
  text: string;
  voice: string;
  createdAt: string;
}

type Voice = {
  text: string;
  voice: Blob;
  createdAt: string;
};

function parseVoiceData(data: VoiceData): Voice {
  const buffer = Buffer.from(data.voice, "base64");
  const blob = new Blob([buffer], {type: "audio/wav"});

  const voice: Voice = {
    text: data.text,
    voice: blob,
    createdAt: data.createdAt.slice(0, 19).replace("T", " "),
  }
  return voice;
}

export function Voice() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [voiceText, setVoiceText] = useState<string>();
  const params = useParams();

  const getVoices = useCallback(() => {
    const url = SERVER_URL + VOICES_URL + "/" + params.id
    axios.get(url)
    .then((response) => {
      const voices: Voice[] = response.data.map((data: VoiceData) => {
        return parseVoiceData(data)
      })
      setVoices(voices)
    })
    .catch((error) =>{
      console.log(error)
    })
  }, [])

  const handlePostRequest = useCallback(() => {
    const url = SERVER_URL + VOICES_URL + "/" + params.id
    const textObj = { text: voiceText }
    axios.post(url, textObj, {})
    .then((response) => {
      const voice = parseVoiceData(response.data)

      setVoices([voice, ...voices]);
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

  useEffect(getVoices, [])

  return (
    <>
      セリフ：<textarea maxLength={MAX_VOICE_TEXT_LENGTH} value={voiceText} onChange={handleVoiceText}></textarea>
      <button onClick={handlePostRequest}>音声合成</button>
      {voicesJsx}
    </>
  );
}
