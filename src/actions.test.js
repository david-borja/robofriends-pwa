import configureMockStore from "redux-mock-store";
import thunkMiddleware from "redux-thunk";
import fetchMock from "fetch-mock";

import * as actions from "./actions";

import {
  CHANGE_SEARCHFIELD,
  REQUEST_ROBOTS_PENDING,
  REQUEST_ROBOTS_SUCCESS,
  REQUEST_ROBOTS_FAILED,
} from "./constants";

const mockStore = configureMockStore([thunkMiddleware]);

it("should create an action to search robots", () => {
  const text = "woo";
  const expectedAction = {
    type: CHANGE_SEARCHFIELD,
    payload: text,
  };
  expect(actions.setSearchField(text)).toEqual(expectedAction);
});

it("handles requesting robots API", () => {
  const store = mockStore();
  store.dispatch(actions.requestRobots());
  const action = store.getActions();
  const expectedAction = {
    type: REQUEST_ROBOTS_PENDING,
  };
  expect(action[0]).toEqual(expectedAction);
});

describe("async actions", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("should create the SUCCESS action after receiving data", () => {
    fetchMock.getOnce("https://jsonplaceholder.typicode.com/users", {
      body: { id: 3, name: "John Whatever", email: "johnwhatever@gmail.com" },
      headers: { "content-type": "application/json" },
    });

    const expectedActions = [
      { type: REQUEST_ROBOTS_PENDING },
      {
        type: REQUEST_ROBOTS_SUCCESS,
        payload: {
          id: 3,
          name: "John Whatever",
          email: "johnwhatever@gmail.com",
        },
      },
    ];

    const store = mockStore();

    return store.dispatch(actions.requestRobots()).then(() => {
      const actions = store.getActions();
      expect(actions).toEqual(expectedActions);
    });
  });

  it("should create the FAILED action when receiving an error", () => {
    fetchMock.getOnce("https://jsonplaceholder.typicode.com/users", {
      throws: "ERROR: could not fetch data",
      headers: { "content-type": "application/json" },
    });

    const expectedActions = [
      { type: REQUEST_ROBOTS_PENDING },
      {
        type: REQUEST_ROBOTS_FAILED,
        payload: "ERROR: could not fetch data",
      },
    ];

    const store = mockStore();

    return store.dispatch(actions.requestRobots()).then(() => {
      const actions = store.getActions();
      expect(actions).toEqual(expectedActions);
    });
  });
});
