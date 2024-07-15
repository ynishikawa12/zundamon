import {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import axios from "axios";
import { SERVER_URL, USER_URL } from "../consts/url";
import { useNavigate } from "react-router-dom";
import { InputUserName } from "./inputs/InputUserName";
import { InputPassword } from "./inputs/InputPassword";
import { InputBirthday } from "./inputs/InputBirthday";
import { InputBio } from "./inputs/InputBio";

const SET_ID = "setId";
const UPDATE_USER_NAME = "updateUserName";
const UPDATE_PASSWORD = "updatePassword";
const UPDATE_BIRTHDAY = "updateBirthday";
const UPDATE_BIO = "updateBio";

type ActionType =
  | typeof UPDATE_USER_NAME
  | typeof UPDATE_PASSWORD
  | typeof UPDATE_BIRTHDAY
  | typeof UPDATE_BIO
  | typeof SET_ID;

type Props = {
  loginedUserId: number;
};

interface FormState {
  id: string;
  name: string;
  password: string;
  birthday: string;
  bio: string;
}

interface Action {
  type: ActionType;
  payload: FormState[keyof FormState];
}

function reducer(state: FormState, action: Action) {
  switch (action.type) {
    case SET_ID: {
      return {
        ...state,
        id: action.payload,
      };
    }
    case UPDATE_USER_NAME: {
      return {
        ...state,
        name: action.payload,
      };
    }
    case UPDATE_PASSWORD: {
      return {
        ...state,
        password: action.payload,
      };
    }
    case UPDATE_BIRTHDAY: {
      return {
        ...state,
        birthday: action.payload,
      };
    }
    case UPDATE_BIO: {
      return {
        ...state,
        bio: action.payload,
      };
    }
  }
}

export function Profile({ loginedUserId: loginedUserId }: Props) {
  const [state, dispatch] = useReducer(reducer, {
    id: "",
    name: "",
    password: "",
    birthday: "",
    bio: "",
  });

  const handleChangeName = useCallback((value: string) => {
    dispatch({
      type: UPDATE_USER_NAME,
      payload: value,
    });
  }, []);

  const handleChangePassword = useCallback((value: string) => {
    dispatch({
      type: UPDATE_PASSWORD,
      payload: value,
    });
  }, []);

  const handleChangeBirthday = useCallback((value: string) => {
    dispatch({
      type: UPDATE_BIRTHDAY,
      payload: value,
    });
  }, []);

  const handleChangeBio = useCallback((value: string) => {
    dispatch({
      type: UPDATE_BIO,
      payload: value,
    });
  }, []);

  const [warningName, setWarningName] = useState<boolean>(false);
  const [warningBirthday, setWarningBirthday] = useState<boolean>(false);
  const [canEditName, handleSetCanEditName] = useState<boolean>(false);
  const [canEditPassword, handleSetCanEditPassword] = useState<boolean>(false);
  const [canEditBirthday, handleSetCanEditBirthday] = useState<boolean>(false);
  const [canEditBio, handleSetCanEditBio] = useState<boolean>(false);

  const navigate = useNavigate();

  const getUser = useCallback(
    (userId: number) => {
      console.log("userId", userId);
      axios
        .get(SERVER_URL + USER_URL + "/" + userId)
        .then(function (response) {
          dispatch({
            type: SET_ID,
            payload: response.data.id,
          });
          dispatch({
            type: UPDATE_USER_NAME,
            payload: response.data.name,
          });
          dispatch({
            type: UPDATE_PASSWORD,
            payload: response.data.password,
          });
          dispatch({
            type: UPDATE_BIO,
            payload: response.data.bio,
          });

          if (response.data.birthday) {
            dispatch({
              type: UPDATE_BIRTHDAY,
              payload: response.data.birthday.slice(0, 10),
            });
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    [name]
  );

  const handleUpdateUser = useCallback(() => {
    const userJson = JSON.stringify(state);
    console.log(state)
    axios
      .patch(SERVER_URL + USER_URL + "/" + state.id, userJson)
      .then(function (response) {
        alert("ユーザーを更新しました");
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [state]);

  // 編集ボタン
  const EditButton = useCallback(
    (handleSetState: React.Dispatch<SetStateAction<boolean>>, disabled: boolean) => {
      return (
        <button disabled={disabled} onClick={() => handleSetState((bool) => !bool)}>
          <img src="src/assets/pencil.svg" height={20} width={20} alt="edit" />
        </button>
      );
    },
    []
  );

  const DisplayUser = useMemo(() => {
    return canEditName ? (
      <InputUserName
        value={state.name}
        onChange={handleChangeName}
        warning={warningName}
        handleSetWarning={setWarningName}
      />
    ) : (
      <>ユーザー名：{state.name}</>
    );
  }, [canEditName, state.name]);

  const DisplayPassword = useMemo(() => {
    return canEditPassword ? (
      <InputPassword value={state.password} onChange={handleChangePassword} />
    ) : (
      <>パスワード：{state.password}</>
    );
  }, [canEditPassword, state.password]);

  const DisplayBirthday = useMemo(() => {
    return canEditBirthday ? (
      <InputBirthday
        value={state.birthday}
        onChange={handleChangeBirthday}
        warning={warningBirthday}
        handleSetWarning={setWarningBirthday}
      />
    ) : (
      <>生年月日（任意）：{state.birthday}</>
    );
  }, [canEditBirthday, state.birthday]);

  const DisplayBio = useMemo(() => {
    return canEditBio ? (
      <InputBio value={state.bio} onChange={handleChangeBio} />
    ) : (
      <>自己紹介（任意）：{state.bio}</>
    );
  }, [canEditBio, state.bio]);

  useEffect(() => getUser(loginedUserId), [loginedUserId]);

  return (
    <>
      <h3>プロフィール</h3>
      <div>
        {DisplayUser}
        {EditButton(handleSetCanEditName, canEditName && warningName)}
      </div>
      <div>
        {DisplayPassword}
        {EditButton(handleSetCanEditPassword, canEditPassword && false)}
      </div>
      <div>
        {DisplayBirthday}
        {EditButton(handleSetCanEditBirthday, canEditBirthday && warningBirthday)}
      </div>
      <div>
        {DisplayBio}
        {EditButton(handleSetCanEditBio, false)}
      </div>
      <button onClick={useCallback(() => navigate("/"), [])}>戻る</button>
      <button
        disabled={warningName || warningBirthday}
        onClick={handleUpdateUser}
      >
        更新
      </button>
    </>
  );
}
