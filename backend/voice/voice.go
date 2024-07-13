package voice

import (
	"bytes"
	"encoding/base64"
	"io"
	"net/http"
	"net/url"
	"time"
	"zundamon/consts"
	"zundamon/db"
	"zundamon/model"
)

func createVoiceVoxVoice(text string) ([]byte, error) {
	// 音声生成用クエリ作成
	queryUrl, err := url.Parse(consts.CREATE_QUERY_URL)
	if err != nil {
		return nil, err
	}

	query := queryUrl.Query()
	query.Set("text", text)
	query.Set("speaker", "1")
	queryUrl.RawQuery = query.Encode()
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
	respVoice, err := http.Post(voiceUrl.String(), "application/json", bytes.NewBuffer(respQuery))
	if err != nil {
		return nil, err
	}
	defer respVoice.Body.Close()

	voiceData, err := io.ReadAll(respVoice.Body)
	if err != nil {
		return nil, err
	}

	return voiceData, nil
}

func CreateVoice(text string, userId int) (*model.Voice, error) {
	voiceData, err := createVoiceVoxVoice(text)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	insertVoice := db.InsertVoiceInfo{
		Text:      text,
		Voice:     voiceData,
		CreatedAt: now,
		UserId:    userId,
	}
	insertId, err := db.InsertVoice(insertVoice)
	if err != nil {
		return nil, err
	}

	modelVoice := model.Voice{
		Id:        int(insertId),
		Text:      text,
		Voice:     base64.StdEncoding.EncodeToString(voiceData),
		CreatedAt: now,
	}

	return &modelVoice, nil
}
