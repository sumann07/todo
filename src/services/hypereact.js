import React, { createElement } from 'react';

const defaultState = {};
let currentState = defaultState;
const { slice } = Array.prototype;
const actionType = Symbol('Action');
const subscribers = [];
const dummyState = {};

function shallowEqual(value1, value2) {
  if (value1 === value2) return true;
  if (value1 instanceof Date && value2 instanceof Date) {
    return value1.getTime() === value2.getTime();
  }
  if (value1 && value2) {
    const value1Keys = Object.keys(value1);
    if (value1Keys.length !== Object.keys(value2).length) return false;
    for (let key of value1Keys) {
      if (value1[key] !== value2[key]) return false;
    }
    return true;
  }
  return false;
}

function notify() {
  for (let i = 0, length = subscribers.length; i < length; i++) {
    subscribers[i](currentState);
  }
}

function createActionStateMapper(mapper) {
  if (!mapper)
    return function(currentState, nextState) {
      // getter
      if (arguments.length < 2) {
        return currentState;
      }
      // setter
      return nextState;
    };
  if (typeof mapper === 'function') {
    return mapper;
  }
  return function(currentState, nextState) {
    // getter
    if (arguments.length < 2) {
      return currentState[mapper];
    }
    // setter
    const subState = currentState[mapper];
    if (typeof subState === 'object' && typeof nextState === 'object') {
      for (let key of Object.keys(nextState)) {
        if (nextState[key] !== subState[key]) {
          return {
            ...currentState,
            [mapper]: nextState
          };
        }
      }
    } else if (subState !== nextState) {
      return {
        ...currentState,
        [mapper]: nextState
      };
    }
    return currentState;
  };
}

function createViewStateMapper(mapper) {
  if (!mapper) {
    return function(currentState, props) {
      return props;
    };
  }
  if (typeof mapper === 'function') {
    return mapper;
  }
  return function(currentState) {
    return currentState[mapper];
  };
}

export function dispatch(action) {
  const args = slice.call(arguments, 1);

  function processResult(nextState) {
    if (action.state) {
      nextState = action.state(currentState, nextState);
    }

    if (nextState !== currentState) {
      currentState = nextState;
      notify();
    }
  }
  // custom action cannot update state
  const isCustomAction = typeof action === 'function';
  let actionResult = isCustomAction
    ? action.apply(null, args)
    : action.dispatch.apply(null, args);
  if (typeof actionResult === 'function') {
    let actionState = currentState;
    if (action.state) {
      // extract action state from root state
      actionState = action.state(currentState);
    }
    actionResult = actionResult.apply(
      null,
      [actionState].concat(action.dispatchers)
    );

    if (isCustomAction) {
      return actionResult;
    }

    if (actionResult !== null && actionResult !== undefined) {
      if (actionResult && actionResult.then) {
        return actionResult.then(processResult);
      } else {
        processResult(actionResult);
      }
    }
  } else if (isCustomAction) {
    return actionResult;
  } else {
    processResult(actionResult);
  }
}

export function dispatcher(actions, dispatcherArray) {
  const dispatcher = Array.isArray(actions) ? [] : {};
  Object.entries(actions).forEach(
    ([name, action]) =>
      (dispatcher[name] = action.dispatcher
        ? action.dispatcher
        : (action.dispatcher = function(...args) {
            return dispatch(action, ...args);
          }))
  );
  return Array.isArray(actions) || !dispatcherArray ? dispatcher : [dispatcher];
}

export function subscirbe(subscriber) {
  let unsubscribed = false;
  subscribers.push(subscriber);
  return function() {
    if (unsubscribed) return;

    unsubscribed = true;
    const index = subscribers.indexOf(subscriber);
    subscribers.splice(index, 1);
  };
}

export function action(options = {}) {
  const { actions = [], state, dispatch } = options;

  return {
    dispatchers: dispatcher(actions, true),
    state: createActionStateMapper(state),
    dispatch,
    [actionType]: true
  };
}

export function view(options = {}) {
  const {
    actions = [],
    state,
    dispatch = (props, dispatchers) =>
      Array.isArray(actions) ? null : dispatchers,
    render: Component
  } = options;
  const stateMapper = createViewStateMapper(state);
  const dispatchers = dispatcher(actions, true);

  return class View extends React.Component {
    constructor(props) {
      super(props);

      this.mappedProps = stateMapper(currentState, props);
      this.dispatchProps = dispatch(this.mappedProps, ...dispatchers);
      this.unsubscribe = subscirbe(() => {
        this.setState(dummyState);
      });
    }

    shouldUpdate(nextProps) {
      const nextMappedProps = stateMapper(currentState, nextProps);
      if (shallowEqual(nextMappedProps, this.mappedProps)) return false;
      this.mappedProps = nextMappedProps;
      this.dispatchProps = dispatch(this.mappedProps, ...dispatchers);
      return true;
    }

    shouldComponentUpdate(nextProps) {
      return this.shouldUpdate(nextProps);
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      return createElement(Component, {
        ...this.mappedProps,
        ...this.dispatchProps
      });
    }
  };
}

export function state(newState) {
  if (!arguments.length) return currentState;
  currentState = {
    ...currentState,
    ...newState
  };
}

export class Dynamic extends React.Component {
  render() {
    if (this.props.promise === this.promise) {
      if (this.loaded) {
        if (typeof this.payload === 'function') {
          return createElement(this.payload, this.props.props);
        }
        return this.payload;
      }
      return this.props.loading;
    }

    this.loaded = false;
    const promise = (this.promise = this.props.promise);
    this.promise.then(
      payload => {
        if (promise === this.promise) {
          this.loaded = true;
          this.payload = payload && payload.default ? payload.default : payload;
          this.setState(dummyState);
        }
      },
      error => {
        if (this.props.failure) {
          this.loaded = true;
          this.payload = this.props.failure(error);
          this.setState(dummyState);
        }
      }
    );
    return this.props.loading;
  }
}

export function dynamic(promise, { loading = null, failure, ...props } = {}) {
  return createElement(Dynamic, {
    promise,
    loading,
    failure,
    props
  });
}

export function cleanUp() {
  currentState = defaultState;
  subscribers.length = 0;
}

export default function(options) {
  // get current state
  if (!arguments.length) return currentState;
  // subscribe state change
  if (typeof options === 'function') {
    return action({ dispatch: options });
  }
  // dispatch action
  if (options[actionType]) {
    const args = slice.call(arguments, 1);
    return dispatch.apply(null, [options].concat(args));
  }
  // create view
  if (typeof options.render === 'function') {
    return view(options);
  }
  // create action
  if (typeof options.dispatch === 'function') {
    return action(options);
  }
  // init state
  return state(options);
}
