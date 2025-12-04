/**
 * Unit tests for debounce utility
 *
 * Tests timing behavior, multiple calls, and cancellation
 */

import debounce from '../debounce';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('executes function after delay', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 500);

    debouncedFunc();

    // Should not execute immediately
    expect(func).not.toHaveBeenCalled();

    // Fast-forward time by 500ms
    jest.advanceTimersByTime(500);

    // Should execute after delay
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('resets timer on multiple calls', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 500);

    debouncedFunc();
    jest.advanceTimersByTime(300);

    // Call again before first execution
    debouncedFunc();
    jest.advanceTimersByTime(300);

    // Should not have executed yet (timer was reset)
    expect(func).not.toHaveBeenCalled();

    // Fast-forward remaining time
    jest.advanceTimersByTime(200);

    // Should execute only once
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('passes arguments to debounced function', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 500);

    debouncedFunc('arg1', 'arg2', 123);

    jest.advanceTimersByTime(500);

    expect(func).toHaveBeenCalledWith('arg1', 'arg2', 123);
  });

  test('preserves this context', () => {
    const obj = {
      value: 42,
      getValue: jest.fn(function () {
        return this.value;
      })
    };

    const debouncedGetValue = debounce(obj.getValue, 500);
    debouncedGetValue.call(obj);

    jest.advanceTimersByTime(500);

    expect(obj.getValue).toHaveBeenCalledTimes(1);
  });

  test('cancel method clears pending execution', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 500);

    debouncedFunc();
    jest.advanceTimersByTime(300);

    // Cancel before execution
    debouncedFunc.cancel();

    // Fast-forward past original delay
    jest.advanceTimersByTime(500);

    // Should not have executed
    expect(func).not.toHaveBeenCalled();
  });

  test('multiple rapid calls only execute once', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 500);

    // Rapid calls
    for (let i = 0; i < 10; i++) {
      debouncedFunc();
      jest.advanceTimersByTime(50);
    }

    // Should not have executed yet
    expect(func).not.toHaveBeenCalled();

    // Fast-forward past last delay
    jest.advanceTimersByTime(500);

    // Should execute only once
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('uses default delay of 500ms', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func); // No delay specified

    debouncedFunc();

    jest.advanceTimersByTime(499);
    expect(func).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('custom delay works correctly', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc();

    jest.advanceTimersByTime(999);
    expect(func).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('cancel on never-called function does not throw', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 500);

    // Should not throw
    expect(() => debouncedFunc.cancel()).not.toThrow();
  });

  test('cancel after execution does not affect next call', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 500);

    debouncedFunc();
    jest.advanceTimersByTime(500);
    expect(func).toHaveBeenCalledTimes(1);

    // Cancel after execution
    debouncedFunc.cancel();

    // Call again
    debouncedFunc();
    jest.advanceTimersByTime(500);

    // Should execute again
    expect(func).toHaveBeenCalledTimes(2);
  });
});
