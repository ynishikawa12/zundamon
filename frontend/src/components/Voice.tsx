import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SERVER_URL, VOICES_URL } from "../consts/url";
import { MAX_VOICE_TEXT_LENGTH } from "../consts/voice";
import { useParams } from "react-router-dom";
import { Buffer } from "buffer";

type VoiceResponse = {
  id: string;
  text: string;
  voice: string;
  createdAt: string;
}

type Voice = {
  id: string;
  text: string;
  voice: Blob;
  createdAt: string;
};

function parseVoiceResponse(data: VoiceResponse): Voice {
  const buffer = Buffer.from(data.voice, "base64");
  const blob = new Blob([buffer], {type: "audio/wav"});

  const voice: Voice = {
    id: data.id,
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
      const voices: Voice[] = response.data.map((data: VoiceResponse) => {
        return parseVoiceResponse(data)
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
      const voice = parseVoiceResponse(response.data)
      setVoices([voice, ...voices]);
      setVoiceText("");
    })
    .catch((error) => {
      console.log(error);
      alert("音声の作成に失敗しました");
    });
  }, [voiceText])

  const handleDeleteRequest = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const id = e.currentTarget.dataset.id
    const url = SERVER_URL + VOICES_URL + "/" + id
    axios.delete(url)
    .then(() => {
      const newVoices = voices.filter(voice => voice.id != id)
      setVoices(newVoices)
    })
    .catch((error) => {
      console.log(error);
      alert("削除に失敗しました");
    })
  },[voices])

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
          <button data-id={voice.id} onClick={handleDeleteRequest}>削除</button>
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
