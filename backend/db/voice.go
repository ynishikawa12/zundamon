package db

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"zundamon/consts"
)

func createVoiceVoxVoice(text string) (io.ReadCloser, error) {
	// 音声生成用クエリ作成
	queryUrl, err := url.Parse(consts.CREATE_QUERY_URL)
	if err != nil {
		return nil, err
	}

	query := queryUrl.Query()
	query.Set("text", text)
	query.Set("speaker", "1")
	queryUrl.RawQuery = query.Encode()
	fmt.Println(queryUrl.String())
	queryResp, err := http.Post(queryUrl.String(), "application/json", nil)
	if err != nil {
		return nil, err
	}
	defer queryResp.Body.Close()

	respQuery, err := io.ReadAll(queryResp.Body)
	if err != nil {
		return nil, err
	}

	// 音声生成
	voiceUrl, err := url.Parse(consts.CREATE_VOICE_URL)
	if err != nil {
		return nil, err
	}

	voiceQuery := voiceUrl.Query()
	voiceQuery.Set("speaker", "1")
	voiceUrl.RawQuery = voiceQuery.Encode()
	voiceResp, err := http.Post(voiceUrl.String(), "application/json", bytes.NewBuffer(respQuery))
	if err != nil {
		return nil, err
	}

	// audioData, err := io.ReadAll(voiceResp.Body)
	// if err != nil {
	// 	return nil, err
	// }

	//base64Audio := base64.StdEncoding.EncodeToString(audioData)

	return voiceResp.Body, nil
}

// anyかえる
func CreateVoice(text string, userId int) (io.ReadCloser, error) {
	voice, err := createVoiceVoxVoice(text)
	if err != nil {
		return nil, err
	}

	return voice, nil
}
