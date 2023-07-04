// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

const url = '/test';

const data = {
  value: 'testValue',
};

jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const setupMockAxios = () => {
    const mockInstance = {
      get: jest.fn().mockResolvedValue({ data }),
    };
    (axios.create as jest.Mock).mockReturnValue(mockInstance);
  };

  test('should create instance with provided base url', async () => {
    const baseURL = 'https://jsonplaceholder.typicode.com';
    setupMockAxios();
    await throttledGetDataFromApi(url);
    expect(axios.create).toHaveBeenCalledWith({ baseURL });
  });

  test('should perform request to correct provided url', async () => {
    setupMockAxios();
    await throttledGetDataFromApi(url);
    jest.runAllTimers();

    const instance = axios.create();
    expect(instance.get).toHaveBeenCalledWith(url);
  });

  test('should return response data', async () => {
    setupMockAxios();
    const receivedData = await throttledGetDataFromApi(url);
    expect(receivedData).toBeTruthy();
    expect(receivedData).toEqual(data);
  });
});
