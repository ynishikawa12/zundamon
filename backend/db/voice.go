package db

import (
	"encoding/base64"
	"zundamon/model"
)

func GetVoices(userId int) ([]model.Voice, error) {
	sql := "SELECT id, text, voice, created_at FROM voices WHERE user_id = ? ORDER BY created_at DESC;"
	rows, err := DB.Query(sql, userId)
	if err != nil {
		return nil, err
	}

	modelVoices := make([]model.Voice, 0)
	for rows.Next() {
		voiceInfo := VoiceInfo{}
		if err := rows.Scan(&voiceInfo.Id, &voiceInfo.Text, &voiceInfo.Voice, &voiceInfo.CreatedAt); err != nil {
			return nil, err
		}

		modelVoice := model.Voice{
			Id:        voiceInfo.Id,
			Text:      voiceInfo.Text,
			Voice:     base64.StdEncoding.EncodeToString(voiceInfo.Voice),
			CreatedAt: voiceInfo.CreatedAt,
		}
		modelVoices = append(modelVoices, modelVoice)
	}

	return modelVoices, nil
}

func InsertVoice(data InsertVoiceInfo) (int64, error) {
	sql := "INSERT INTO voices (text, voice, created_at, user_id) VALUES(?, ?, ?, ?)"
	ins, err := DB.Prepare(sql)
	if err != nil {
		return 0, err
	}

	result, err := ins.Exec(data.Text, data.Voice, data.CreatedAt, data.UserId)
	if err != nil {
		return 0, err
	}
	insertId, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return insertId, nil
}

func DeleteVoice(id int) error {
	sql := "DELETE FROM voices WHERE id=?"
	del, err := DB.Prepare(sql)
	if err != nil {
		return err
	}

	_, err = del.Exec(id)
	if err != nil {
		return err
	}

	return nil
}
