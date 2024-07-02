package db

import (
	"fmt"
	"io"
	"zundamon/voice"
)

func InsertVoice(text string, id int) (*VoiceInfo, error) {
	voice, err := voice.CreateVoice(text, id)
	if err != nil {
		return nil, err
	}
	defer voice.Close()

	binaryVoice, err := io.ReadAll(voice)
	if err != nil {
		return nil, err
	}

	fmt.Println(binaryVoice)
	return nil, err
}
