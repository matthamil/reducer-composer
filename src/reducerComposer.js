const GET_ACCESSOR_TYPE = "GET";
const SET_ACCESSOR_TYPE = "SET";

function mergeState(state, action, accessors, modifier) {
  const [accessor, ...remainingAccessors] = accessors;

  if (accessors.length === 0) {
    return {
      ...state,
      ...modifier(state, action)
    };
  }

  if (accessor.type === GET_ACCESSOR_TYPE) {
    return {
      ...state,
      [accessor.payload.key]: mergeState(
        state[accessor.payload.key],
        action,
        remainingAccessors,
        modifier
      )
    };
  }

  if (accessor.type === SET_ACCESSOR_TYPE) {
    return mergeState(
      {
        ...state,
        [accessor.payload.key]: mergeState(
          {
            ...state[accessor.payload.key],
            ...accessor.payload.data
          },
          action,
          remainingAccessors,
          modifier
        )
      },
      action,
      remainingAccessors,
      modifier
    );
  }
}

function accessorFactory(type, payload) {
  return {
    type,
    payload
  };
}

export function reducerComposer(...fns) {
  return (state, action) => {
    let currentState = state;
    let accessors = [];

    for (let i = 0; i < fns.length; i++) {
      const reducer = fns[i];
      if (i === fns.length - 1) {
        return mergeState(state, action, accessors, reducer);
      }

      let stateKey;

      currentState = proxyFactory(currentState, prop => {
        stateKey = prop;
      });

      const reducedValue = reducer(currentState, action);
      if (typeof reducedValue === "string") {
        stateKey = reducedValue;
        const accessor = accessorFactory("GET", { key: stateKey });
        accessors.push(accessor);
      } else if (
        typeof reducedValue === "object" &&
        stateKey !== reducedValue
      ) {
        const accessor = accessorFactory("SET", {
          key: stateKey,
          data: reducedValue
        });
        accessors.push(accessor);
      }

      if (currentState[stateKey] === undefined) {
        return state;
      }

      currentState = state[stateKey];
    }
  };
}

function proxyFactory(obj, accessorCallback) {
  if (typeof obj !== "object") {
    return obj;
  }

  return new Proxy(obj, {
    get: (_, prop) => {
      if (obj[prop] === undefined) {
        return undefined;
      }
      accessorCallback(prop);
      return proxyFactory(obj[prop], accessorCallback);
    }
  });
}
