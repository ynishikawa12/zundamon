import React, { ChangeEvent, useState } from 'react';
import axios from 'axios';

type Mora = {
  text: string
  consonant: string
  consonant_length: number
  vowel: string
  vowel_length: number
  pitch: number
}

//Query型定義
type Query = {
  accent_phrases: {
      moras: Mora[]
      accent: number
      pause_mora: Mora
  }
  speedScale: number
  pitchScale: number
  intonationScale: number
  volumeScale: number
  prePhonemeLength: number
  postPhonemeLength: number
  outputSamplingRate: number
  outputStereo: boolean
  kana: string
}

//DBデータ追加用
type ZundaVoiceData = {
  line: string
  voice: Blob
}

//Goにdataを送りDBに登録（Go処理未実装）
function insertZundaVoiceTable(data: ZundaVoiceData): void {
  axios.post('http://localhost:8080/insertVoice', data)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
}

function App() {
  const [inputText, setInputText] = useState<string>('')
  const [queryJson, setQueryJson] = useState<Query>()
  const [audioData, setAudioData] = useState<Blob>() 
  
  //入力テキストから音声合成用クエリを作成
  const createQuery = async () => {
    const res = await axios.post(`http://localhost:50021/audio_query?speaker=1&text=${inputText}`)

    if (!res) return

    setQueryJson(res.data as Query)
  }

  //クエリから音声合成
  const createVoice = async () => {
    const res = await axios.post('http://localhost:50021/synthesis?speaker=1',
      queryJson,
      { responseType: "blob" }
    )
    
    if (!res) return

    setAudioData(res.data as Blob)

    //DBにも追加（Go処理未実装）
    insertZundaVoiceTable({line: inputText} as ZundaVoiceData)
  }

  return (
    <div className='App-header'>
      <div>
        <h2>読み上げたい文章を入力</h2>
        <textarea 
          value={inputText}
          onChange={
            (e: ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)
          }
        />
      </div>

      {inputText ? (
        <div>
          <p>↓</p>
          <h2>文章からクエリデータを作成</h2>
          <button onClick={createQuery}>クエリ作成</button>
        </div>
      ) : null}

      {queryJson ? (
        <div>
          <p>↓</p>
          <h2>クエリデータから音声を合成</h2>
          <button onClick={createVoice}>音声合成</button>
        </div>
      ) : null}
      
      {audioData ? (
        <div>
          <p>↓</p>
          <h2>返却された音声ファイルを再生</h2>
          <audio
            controls
            src={audioData ? window.URL.createObjectURL(audioData) : undefined}>
          </audio>
        </div>
      ) : null}
    </div>
  );
}

export default App;