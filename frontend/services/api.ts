import axios from 'axios';

// API 기본 URL 설정 - 실제 디바이스에서 테스트할 때는 컴퓨터의 IP 주소로 변경
// 예: 'http://192.168.1.100:8000'
const BASE_URL = 'https://7f95-121-187-226-243.ngrok-free.app';

// 개발 환경에서는 localhost 사용 (웹 에뮬레이터에서 테스트할 때)
// const BASE_URL = 'http://localhost:8000';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 요청 전에 실행
api.interceptors.request.use(
  (config) => {
    console.log(`API 요청: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API 요청 오류:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 응답을 받은 후 실행
api.interceptors.response.use(
  (response) => {
    console.log(`API 응답: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API 응답 오류:', error);
    return Promise.reject(error);
  }
);

// API 엔드포인트 함수들
export const apiService = {
  // 테스트 엔드포인트
  testConnection: async () => {
    try {
      const response = await api.get('/test/');
      return response.data;
    } catch (error) {
      console.error('테스트 연결 오류:', error);
      throw error;
    }
  },

  // 이미지 분석 엔드포인트
  analyzeFoodImage: async (imageUri: string) => {
    try {
      console.log('이미지 URI:', imageUri); // 디버깅을 위한 로그 추가
      
      // 이미지를 Blob으로 변환
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      console.log('Blob 크기:', blob.size); // 디버깅을 위한 로그 추가
      
      // FormData 구성
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg', // 또는 실제 이미지 타입에 맞게 설정
        name: 'food_image.jpg'
      } as any);
      
      console.log('FormData:', formData); // 디버깅을 위한 로그 추가
      
      // 서버로 요청 전송
      const serverResponse = await api.post('/predict/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data, headers) => {
          return data; // FormData를 변환하지 않고 그대로 전송
        },
      });
      
      return serverResponse.data;
    } catch (error) {
      console.error('이미지 분석 오류:', error);
      throw error;
    }
  },

  // 음식 목록 가져오기
  getFoodList: async () => {
    try {
      const response = await api.get('/foods/');
      return response.data;
    } catch (error) {
      console.error('음식 목록 가져오기 오류:', error);
      throw error;
    }
  },

  // 특정 음식 정보 가져오기
  getFoodInfo: async (foodName: string) => {
    try {
      const response = await api.get(`/food/${foodName}`);
      return response.data;
    } catch (error) {
      console.error('음식 정보 가져오기 오류:', error);
      throw error;
    }
  },
};

export default api; 