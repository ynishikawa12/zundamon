package errors

import "errors"

var (
	ErrorNameIsTooLong = errors.New("name is too long")
	ErrorBioIsTooLong  = errors.New("bio is too long")
)
