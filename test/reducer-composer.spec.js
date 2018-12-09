import { reducerComposer } from "../src";

describe("reducerComposer", () => {
  it("should change a value in state", () => {
    const state = {
      "1234-asdf-6789": {
        movie: {
          title: "JavaScript, the Movie",
          hasWatched: false
        }
      }
    };

    const action = {
      type: "MOVIES/COMPLETE_WATCHING",
      payload: {
        movieId: "1234-asdf-6789",
        hasWatched: true
      }
    };

    const movieReducer = reducerComposer(
      (state, action) => action.payload.movieId,
      (state, _action) => state.movie,
      (_state, action) => ({
        hasWatched: action.payload.hasWatched
      })
    );

    const newState = movieReducer(state, action);

    expect(newState["1234-asdf-6789"].movie.hasWatched).toBe(true);
  });

  it("should not mutate values other than the one changed in the last function", () => {
    const state = {
      "1234-asdf-6789": {
        movie: {
          title: "JavaScript, the Movie",
          hasWatched: false
        }
      }
    };

    const action = {
      type: "MOVIES/COMPLETE_WATCHING",
      payload: {
        movieId: "1234-asdf-6789",
        hasWatched: true
      }
    };

    const movieReducer = reducerComposer(
      (state, action) => action.payload.movieId,
      (state, _action) => state.movie,
      (_state, action) => ({
        hasWatched: action.payload.hasWatched
      })
    );

    const newState = movieReducer(state, action);

    expect(newState["1234-asdf-6789"].movie.title).toBe(
      "JavaScript, the Movie"
    );
  });
});
