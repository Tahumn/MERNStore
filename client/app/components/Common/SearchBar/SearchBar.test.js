import SearchBar from './index';

const createInstance = props => {
  const instance = new SearchBar(props);
  instance.setState = update => {
    const changes =
      typeof update === 'function' ? update(instance.state, instance.props) : update;
    instance.state = {
      ...instance.state,
      ...changes
    };
  };
  return instance;
};

describe('SearchBar logic', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('debounces onSearch callback', () => {
    const onSearch = jest.fn();
    const instance = createInstance({ onSearch });

    instance._onChange({
      target: { name: 'search', value: 'smartphone' }
    });

    expect(onSearch).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);

    expect(onSearch).toHaveBeenCalledWith({
      name: 'search',
      value: 'smartphone'
    });
  });

  test('submits the current value immediately on form submit', () => {
    const onSearchSubmit = jest.fn();
    const instance = createInstance({ onSearchSubmit, name: 'keyword' });

    instance.setState({ value: 'watch' });

    instance._handleSubmit({
      preventDefault: jest.fn()
    });

    expect(onSearchSubmit).toHaveBeenCalledWith({
      name: 'keyword',
      value: 'watch'
    });
  });

  test('propagates blur information to parent listeners', () => {
    const onBlur = jest.fn();
    const instance = createInstance({ onBlur });

    instance._onBlur({
      target: { name: 'search', value: 'headphones' }
    });

    expect(onBlur).toHaveBeenCalledWith({
      name: 'search',
      value: 'headphones'
    });
  });
});
