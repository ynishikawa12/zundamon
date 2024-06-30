package db

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"zundamon/consts"
)

func createVoiceVoxQuery(text string) (any, error) {
	url, err := url.Parse(consts.CREATE_QUERY_URL)
	if err != nil {
		return nil, err
	}

	query := url.Query()
	query.Set("text", text)
	query.Set("speaker", "1")
	url.RawQuery = query.Encode()
	fmt.Println(url.String())

	client := &http.Client{}
	req, err := http.NewRequest("POST", url.String(), nil)
	if err != nil {
		return nil, err
	}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return body, nil
}

func createVoiceVoxVoice(voiceVoxQuery any) (string, error) {
	url, err := url.Parse(consts.CREATE_VOICE_URL)
	if err != nil {
		return "", err
	}

	query := url.Query()
	query.Set("speaker", "1")

	marshalled, err := json.Marshal(voiceVoxQuery)
	if err != nil {
		return "", err
	}

	voiceReq, err := http.NewRequest("POST", url.String(), bytes.NewReader(marshalled))
	if err != nil {
		return "", err
	}

	client := &http.Client{}
	voiceResp, err := client.Do(voiceReq)
	if err != nil {
		return "", err
	}
	defer voiceResp.Body.Close()

	audioData, err := io.ReadAll(voiceResp.Body)
	if err != nil {
		return "", err
	}

	base64Audio := base64.StdEncoding.EncodeToString(audioData)

	return base64Audio, nil
}

// anyかえる
func CreateVoice(text string, userId int) (string, error) {
	query, err := createVoiceVoxQuery(text)
	if err != nil {
		return "", err
	}

	voice, err := createVoiceVoxVoice(query)
	if err != nil {
		return "", err
	}

	return voice, nil
}
