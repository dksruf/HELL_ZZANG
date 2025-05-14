/**
 * HELLZANG 메인 화면 (HomeScreen)
 *
 * 전체 앱의 핵심 데이터 흐름과 UI/UX를 담당하는 엔트리포인트입니다.
 *
 * [프로젝트 구조]
 * - /frontend/app/(tabs)/index.tsx: 메인 홈 화면
 * - /frontend/components/: 재사용 UI/모달/카드 컴포넌트
 * - /frontend/models/: 데이터 모델(Macro, Meal)
 * - /frontend/services/: 서비스 로직(NutritionTracker, API)
 * - /frontend/styles/: 공통 스타일
 *
 * [주요 기능]
 * - 칼로리/영양성분 목표 및 섭취량 시각화
 * - 식사 추가/수정/삭제, 저장 음식 관리
 * - 사진 분석 및 결과 수정
 * - 목표 칼로리/영양성분 설정(비율 자동계산)
 * - 데이터 영속성(IndexedDB)
 *
 * [컴포넌트 구조]
 * - AppHeader, CalorieCard, MacrosCard, RecentMealsSection, FloatingButtons, LoadingOverlay 등
 * - AddMealModal, SettingsModal, AnalysisResultModal 등 다양한 모달
 *
 * [데이터 흐름]
 * - 사용자 입력 → NutritionTracker 서비스로 전달 → 모델/스토리지 반영 → UI에 표시
 * - 목표 설정 시 칼로리/영양성분 비율 자동 계산 및 저장
 *
 * [서비스 연동]
 * - NutritionTracker: 칼로리/영양성분/식사/저장음식 관리, 데이터 영속성
 * - API: 음식 사진 분석 등
 */

/**
 * HELLZANG 앱의 메인 화면 (HomeScreen)
 * 
 * 프로젝트 구조:
 * /frontend
 * ├── app/
 * │   └── (tabs)/
 * │       └── index.tsx      # 메인 홈 화면 (현재 파일)
 * │
 * ├── components/            # 재사용 가능한 컴포넌트들
 * │   ├── ui/               # 기본 UI 컴포넌트들
 * │   │   ├── IconSymbol.tsx        # 아이콘 컴포넌트
 * │   │   └── TabBarBackground.tsx  # 탭바 배경 컴포넌트
 * │   │
 * │   ├── AppHeader.tsx            # 앱 헤더 컴포넌트
 * │   ├── ThemedText.tsx           # 테마가 적용된 텍스트 컴포넌트
 * │   ├── ThemedView.tsx           # 테마가 적용된 뷰 컴포넌트
 * │   ├── CircularProgress.tsx     # 원형 프로그레스바 컴포넌트
 * │   ├── MacroProgress.tsx        # 영양소 진행 상태 표시 컴포넌트
 * │   ├── MealCard.tsx             # 식사 카드 컴포넌트
 * │   ├── CalorieCard.tsx          # 칼로리 정보 카드 컴포넌트
 * │   ├── MacrosCard.tsx           # 영양소 정보 카드 컴포넌트
 * │   ├── RecentMealsSection.tsx   # 최근 식사 목록 컴포넌트
 * │   ├── FloatingButtons.tsx      # 플로팅 버튼들 컴포넌트
 * │   ├── LoadingOverlay.tsx       # 로딩 오버레이 컴포넌트
 * │   │
 * │   ├── Collapsible.tsx          # 접을 수 있는 섹션 컴포넌트
 * │   ├── ParallaxScrollView.tsx   # 스크롤 효과 컴포넌트
 * │   ├── HapticTab.tsx            # 햅틱 피드백 탭 컴포넌트
 * │   │
 * │   └── modals/                  # 모달 컴포넌트들
 * │       ├── AddMealModal.tsx     # 식사 추가 통합 모달
 * │       ├── SettingsModal.tsx    # 설정 모달
 * │       ├── CustomAlert.tsx      # 커스텀 알림 모달
 * │       ├── FixResultsModal.tsx  # 분석 결과 수정 모달
 * │       ├── DescribeFoodModal.tsx # 음식 설명 입력 모달
 * │       └── SavedFoodsModal.tsx  # 저장된 음식 목록 모달
 * │
 * ├── models/              # 데이터 모델
 * │   ├── Macro.ts        # 영양소 데이터 모델
 * │   └── Meal.ts         # 식사 데이터 모델
 * │
 * ├── services/           # 서비스 로직
 * │   ├── NutritionTracker.ts  # 영양소 추적 서비스
 * │   └── api.ts          # API 통신 서비스
 * │
 * └── styles/             # 스타일 정의
 *     └── index.ts        # 공통 스타일 정의
 * 
 * 주요 기능:
 * 1. 칼로리 및 영양소 추적
 *    - 현재 섭취량과 목표량 표시
 *    - 원형 프로그레스바로 시각화
 *    - 영양소별 진행 상태 표시
 * 2. 식사 관리
 *    - 식사 추가 (카메라/갤러리/직접 입력)
 *    - 식사 수정 및 삭제
 *    - 저장된 음식 관리
 *    - 식사 분석 결과 수정
 * 3. 설정
 *    - 목표 칼로리 설정
 *    - 영양소 비율 조정
 * 4. UI/UX
 *    - 햅틱 피드백
 *    - 스크롤 효과
 *    - 접을 수 있는 섹션
 *    - 테마 지원
 * 
 * 컴포넌트 구조:
 * 1. 기본 UI 컴포넌트
 *    - ThemedText: 테마가 적용된 텍스트
 *    - ThemedView: 테마가 적용된 뷰
 *    - IconSymbol: 아이콘
 *    - TabBarBackground: 탭바 배경
 * 
 * 2. 메인 화면 컴포넌트
 *    - AppHeader: 앱 타이틀과 설정 버튼
 *    - CalorieCard: 칼로리 정보 표시
 *    - MacrosCard: 영양소 정보 표시
 *    - RecentMealsSection: 최근 추가된 식사 목록
 *    - FloatingButtons: 서버 테스트 및 식사 추가 버튼
 *    - LoadingOverlay: 로딩 상태 표시
 * 
 * 3. 기능 컴포넌트
 *    - CircularProgress: 원형 프로그레스바
 *    - MacroProgress: 영양소 진행 상태
 *    - MealCard: 식사 카드
 *    - Collapsible: 접을 수 있는 섹션
 *    - ParallaxScrollView: 스크롤 효과
 *    - HapticTab: 햅틱 피드백 탭
 * 
 * 4. 모달 컴포넌트
 *    - AddMealModal: 식사 추가 기능 통합
 *    - SettingsModal: 목표 칼로리 및 영양소 설정
 *    - CustomAlert: 사용자 알림
 *    - FixResultsModal: 분석 결과 수정
 *    - DescribeFoodModal: 음식 설명 입력
 *    - SavedFoodsModal: 저장된 음식 목록
 * 
 * 데이터 흐름:
 * 1. 사용자 입력 → 이벤트 핸들러
 * 2. NutritionTracker 서비스로 데이터 전달
 * 3. Macro와 Meal 모델을 통해 데이터 관리
 * 4. UI 컴포넌트들을 통해 사용자에게 표시
 */

// ============================================================================
// React Native의 기본 컴포넌트들을 임포트
// ============================================================================
import { Button, StyleSheet, View, ScrollView, TouchableOpacity, Modal, TextInput, Image, Platform, Linking, Text, ActivityIndicator } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import Svg, { Circle } from 'react-native-svg';
import React ,{ useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { CircularProgress as CircularProgressComponent } from '../../components/CircularProgress';
import { MacroProgress } from '../../components/MacroProgress';
import { MealCard } from '../../components/MealCard';
import { Macro } from '../../models/Macro';
import { MACRO_COLORS } from '../../models/Macro';
import { Meal } from '../../models/Meal';
import { NutritionTracker } from '../../services/NutritionTracker';
import { apiService } from '../../services/api';
import * as ImagePicker from 'expo-image-picker';

// ============================================================================
// 모달 컴포넌트들을 임포트
// ============================================================================
import { SettingsModal } from '../../components/SettingsModal';
import { CustomAlert } from '../../components/CustomAlert';
import { CircularProgress } from '../../components/CircularProgress';
import { FixResultsModal } from '../../components/FixResultsModal';
import { AddMealModal } from '../../components/AddMealModal';
import { CameraModal } from '../../components/CameraModal';
import { DescribeFoodModal } from '../../components/DescribeFoodModal';
import { AnalysisResultModal } from '../../components/AnalysisResultModal';

// ============================================================================
// 스타일 임포트
// ============================================================================
import { styles } from '../../styles/index';

// ============================================================================
// 타입 정의
// ============================================================================
interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (settings: { totalCalories: number; macros: Macro[] }) => void;
  currentValues: {
    totalCalories: number;
    macros: Macro[];
  };
}

interface AnalyzedFoodData {
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

// ============================================================================
// 영양소 관련 상수
// ============================================================================
const NUTRIENT_CALORIES = {
  CARBS: 4,    // 4kcal/g
  PROTEIN: 4,  // 4kcal/g
  FAT: 9,      // 9kcal/g
};

const NUTRIENT_RATIO = {
  CARBS: 5,    // 50%
  PROTEIN: 3,  // 30%
  FAT: 2,      // 20%
};

// ============================================================================
// 유틸리티 함수들
// ============================================================================
const calculateMacrosForCalories = (calories: number) => {
  // 전체 비율 계산 (5:3:2)
  const totalRatio = NUTRIENT_RATIO.CARBS + NUTRIENT_RATIO.PROTEIN + NUTRIENT_RATIO.FAT;
  
  // 각 영양소의 칼로리 계산
  const carbsCalories = (calories * NUTRIENT_RATIO.CARBS) / totalRatio;
  const proteinCalories = (calories * NUTRIENT_RATIO.PROTEIN) / totalRatio;
  const fatCalories = (calories * NUTRIENT_RATIO.FAT) / totalRatio;

  // 그램으로 변환
  const carbsGrams = Math.round(carbsCalories / NUTRIENT_CALORIES.CARBS);
  const proteinGrams = Math.round(proteinCalories / NUTRIENT_CALORIES.PROTEIN);
  const fatGrams = Math.round(fatCalories / NUTRIENT_CALORIES.FAT);

  return {
    protein: proteinGrams,
    carbs: carbsGrams,
    fat: fatGrams
  };
};

// ============================================================================
// 기본 설정값
// ============================================================================
const DEFAULT_CALORIES = 2000;
const macros = calculateMacrosForCalories(DEFAULT_CALORIES);
const initialMacros = [
        new Macro('Protein', 0, macros.protein, 'g', MACRO_COLORS.Protein),
        new Macro('Carbs', 0, macros.carbs, 'g', MACRO_COLORS.Carbs),
        new Macro('Fat', 0, macros.fat, 'g', MACRO_COLORS.Fat),
];

// ============================================================================
// NutritionTracker 인스턴스 생성
// ============================================================================
const tracker = new NutritionTracker(DEFAULT_CALORIES, initialMacros);

// ============================================================================
// HomeScreen 컴포넌트 정의
// ============================================================================
import { CalorieCard } from '../../components/CalorieCard';
import { MacrosCard } from '../../components/MacrosCard';
import { RecentMealsSection } from '../../components/RecentMealsSection';
import { FloatingButtons } from '../../components/FloatingButtons';
import { AppHeader } from '../../components/AppHeader';
import { LoadingOverlay } from '../../components/LoadingOverlay';

function getTodayString() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function HomeScreen() {
  // ============================================================================
  // 모달 관련 상태
  // ============================================================================
  const [modalVisible, setModalVisible] = useState(false);
  const [addMealModalVisible, setAddMealModalVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // ============================================================================
  // 음식 입력 관련 상태
  // ============================================================================
  const [foodName, setFoodName] = useState('');
  const [foodCalories, setFoodCalories] = useState('');
  const [foodProtein, setFoodProtein] = useState('');
  const [foodCarbs, setFoodCarbs] = useState('');
  const [foodFat, setFoodFat] = useState('');
  const [foodGrams, setFoodGrams] = useState('');
  
  // ============================================================================
  // 알림 관련 상태
  // ============================================================================
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  
  // ============================================================================
  // 이미지 분석 관련 상태
  // ============================================================================
  const [analysisResultVisible, setAnalysisResultVisible] = useState(false);
  const [analysisResult, setAnalysisResult] = useState({
    name: '',
    koreanName: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    grams: 100,
    imageUri: undefined as string | undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fixResultsVisible, setFixResultsVisible] = useState(false);
  const [editingFood, setEditingFood] = useState<AnalyzedFoodData>({
    name: '',
    quantity: 0,
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });
  const [editingExistingMeal, setEditingExistingMeal] = useState(false);
  const [editingMealIndex, setEditingMealIndex] = useState<number | null>(null);

  // ============================================================================
  // 카메라 모달 상태 추가
  // ============================================================================
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  
  // ============================================================================
  // 라우터 파라미터 처리
  // ============================================================================
  const params = useLocalSearchParams<{ imageUri?: string }>();

  // ============================================================================
  // 새로운 상태 추가
  // ============================================================================
  const [describeModalVisible, setDescribeModalVisible] = useState(false);

  // ============================================================================
  // useEffect 훅
  // ============================================================================
  useEffect(() => {
    // 299~307, 432~444 줄의 setCurrentImageUri, setAnalysisModalVisible, setAnalyzedFoodData 관련 코드 완전 삭제
  }, [params.imageUri]);

  // ============================================================================
  // 계산된 값들
  // ============================================================================
  const today = getTodayString();
  const caloriePercentage = tracker.getCaloriePercentage();
  const caloriesLeft = tracker.getCaloriesLeft();
  const macros = tracker.getMacros();
  const totalCalories = tracker.getTotalCalories();
  const consumedCalories = tracker.getMeals(today).reduce(
    (total, meal) => total + meal.calories,
    0
  );
  const consumedMacros = tracker.getConsumedMacros(today);

  // ============================================================================
  // 유틸리티 함수들
  // ============================================================================
  const isValidNumber = (num: number) => !isNaN(num) && num !== null && num !== undefined;

  // ============================================================================
  // 이벤트 핸들러 함수들
  // ============================================================================
  const handleSettingsSave = async (settings: { totalCalories: number; macros: Macro[] }) => {
    try {
      // macros가 비어있거나, 칼로리만 바뀐 경우 자동 계산
      let macros = settings.macros;
      if (!macros || macros.length === 0) {
        const calculated = calculateMacrosForCalories(settings.totalCalories);
        macros = [
          new Macro('Protein', 0, calculated.protein, 'g', MACRO_COLORS.Protein),
          new Macro('Carbs', 0, calculated.carbs, 'g', MACRO_COLORS.Carbs),
          new Macro('Fat', 0, calculated.fat, 'g', MACRO_COLORS.Fat),
        ];
      }
      await tracker.updateSettings(settings.totalCalories, macros);
      setModalVisible(false);
      showAlert('성공', '설정이 저장되었습니다.');
    } catch (error) {
      console.error('설정 저장 실패:', error);
      showAlert('오류', '설정 저장 중 오류가 발생했습니다.');
    }
  };

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleAddMeal = async (meal: Meal) => {
    try {
      const mealWithDate = Meal.fromFormData(
        meal.name,
        meal.koreanName,
        meal.calories,
        meal.protein,
        meal.carbs,
        meal.fat,
        meal.grams,
        meal.imageUri,
        today
      );
      await tracker.addMeal(mealWithDate);
      setAddMealModalVisible(false);
      setRefreshKey(prev => prev + 1); // 화면 새로고침
    } catch (error) {
      console.error('식사 추가 실패:', error);
      showAlert('오류', '식사 추가 중 오류가 발생했습니다.');
    }
  };

  const handleSaveFood = async (meal: Meal) => {
    try {
      await tracker.saveFood(meal);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('음식 저장 실패:', error);
      showAlert('오류', '음식 저장 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteSavedFood = async (index: number) => {
    try {
      await tracker.deleteSavedFood(index);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('저장된 음식 삭제 실패:', error);
      showAlert('오류', '저장된 음식 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleEditMeal = async (index: number) => {
    try {
      const meal = tracker.getMeals(today)[index];
      setAnalysisResult({
        name: meal.name,
        koreanName: meal.koreanName,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fats: meal.fat,
        grams: meal.grams,
        imageUri: meal.imageUri,
      });
      setEditingMealIndex(index);
      setAnalysisResultVisible(true);
    } catch (error) {
      console.error('식사 수정 실패:', error);
      showAlert('오류', '식사 수정 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteMeal = async (index: number) => {
    try {
      await tracker.deleteMeal(today, index);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('식사 삭제 실패:', error);
      showAlert('오류', '식사 삭제 중 오류가 발생했습니다.');
    }
  };

  // ============================================================================
  // API 관련 함수들
  // ============================================================================
  const testServerConnection = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.testConnection();
      showAlert('테스트 성공', `서버 응답: ${data.message}`);
    } catch (err) {
      console.error('서버 테스트 오류:', err);
      showAlert('테스트 실패', '서버 연결에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeFoodImage = async (imageUri: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await apiService.analyzeFoodImage(imageUri);
      
      console.log('서버 응답 데이터:', data);
      
      setAnalysisResult({
        name: data.food || '음식',
        koreanName: data.korean_name || data.food || '음식',
        calories: data.calories || 0,
        protein: data.protein || 0,
        carbs: data.carbs || 0,
        fats: data.fats || 0,
        grams: 100,
        imageUri: undefined,
      });
      
      setAnalysisResultVisible(true);
    } catch (err) {
      console.error('이미지 분석 오류:', err);
      setError('이미지 분석 중 오류가 발생했습니다.');
      showAlert('오류', '이미지 분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // 이미지 분석 완료 핸들러 추가
  // ============================================================================
  const handleImageAnalyzed = (imageUri: string, analyzedData: {
    name: string;
    koreanName?: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }) => {
    setAnalysisResult({
      name: analyzedData.name || '',
      koreanName: analyzedData.koreanName || analyzedData.name || '',
      calories: analyzedData.calories || 0,
      protein: analyzedData.protein || 0,
      carbs: analyzedData.carbs || 0,
      fats: analyzedData.fats || 0,
      grams: 100,
      imageUri,
    });
    setAnalysisResultVisible(true);
  };

  // ============================================================================
  // 렌더링 부분
  // ============================================================================
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initialize() {
      await tracker.init(); // 데이터 불러오기
      setRefreshKey(prev => prev + 1); // 화면 새로고침
      setIsReady(true);
    }
    initialize();
  }, []);

  if (!isReady) return <LoadingOverlay visible={true} />;

  // MacrosCard에 전달하는 값 디버깅 출력
  console.log('MacrosCard 목표값:', tracker.getMacros());
  console.log('MacrosCard 섭취값:', consumedMacros);

  return (
    <ThemedView style={styles.container} key={refreshKey}>
      {/* 모달 컴포넌트들 */}
      <SettingsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSettingsSave}
        currentValues={{
          totalCalories: tracker.getTotalCalories(),
          macros: tracker.getMacros()
        }}
      />

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />


      <AddMealModal
        visible={addMealModalVisible}
        onClose={() => setAddMealModalVisible(false)}
        onSave={handleAddMeal}
        savedFoods={tracker.getSavedFoods()}
        onDeleteSavedFood={handleDeleteSavedFood}
        onSaveFood={handleSaveFood}
      />

      <CameraModal
        visible={cameraModalVisible}
        onClose={() => setCameraModalVisible(false)}
        onImageAnalyzed={handleImageAnalyzed}
      />

      <DescribeFoodModal
        visible={describeModalVisible}
        onClose={() => setDescribeModalVisible(false)}
        onSave={() => {
          const meal = Meal.fromFormData(
            foodName,
            foodName, // 한글 이름이 없는 경우 영어 이름 사용
            parseInt(foodCalories),
            parseInt(foodProtein),
            parseInt(foodCarbs),
            parseInt(foodFat),
            parseInt(foodGrams),
            undefined,
            today
          );
          handleAddMeal(meal);
          setDescribeModalVisible(false);
        }}
        foodName={foodName}
        setFoodName={setFoodName}
        foodCalories={foodCalories}
        setFoodCalories={setFoodCalories}
        foodProtein={foodProtein}
        setFoodProtein={setFoodProtein}
        foodCarbs={foodCarbs}
        setFoodCarbs={setFoodCarbs}
        foodFat={foodFat}
        setFoodFat={setFoodFat}
        foodGrams={foodGrams}
        setFoodGrams={setFoodGrams}
      />

      <AnalysisResultModal
        visible={analysisResultVisible}
        imageUri={analysisResult.imageUri}
        initialName={analysisResult.name}
        initialKoreanName={analysisResult.koreanName}
        initialCalories={analysisResult.calories}
        initialProtein={analysisResult.protein}
        initialCarbs={analysisResult.carbs}
        initialFats={analysisResult.fats}
        initialGrams={analysisResult.grams}
        onClose={() => {
          setAnalysisResultVisible(false);
          setEditingMealIndex(null);
        }}
        onSave={(data) => {
          const meal = Meal.fromFormData(
            data.name,
            data.koreanName || data.name,
            data.calories,
            data.protein,
            data.carbs,
            data.fat,
            data.grams,
            data.imageUri,
            today
          );
          if (editingMealIndex !== null) {
            tracker.updateMeal(today, editingMealIndex, meal);
            setEditingMealIndex(null);
          } else {
            handleAddMeal(meal);
            handleSaveFood(meal);
          }
          setAnalysisResultVisible(false);
          setRefreshKey(prev => prev + 1);
        }}
      />

      <AppHeader onSettingsPress={() => setModalVisible(true)} />

      <ScrollView style={styles.content}>
        <CalorieCard
          consumedCalories={consumedCalories}
          caloriesLeft={caloriesLeft}
          caloriePercentage={caloriePercentage}
        />

        <MacrosCard
          macros={tracker.getMacros()}
          consumedMacros={consumedMacros}
        />

        <RecentMealsSection
          meals={tracker.getMeals(today)}
          onDelete={handleDeleteMeal}
          onEdit={handleEditMeal}
        />
      </ScrollView>

      <View style={styles.floatingButtonContainer}>
        
        <TouchableOpacity 
          style={[styles.floatingButton, styles.cameraButton]}
          onPress={() => setCameraModalVisible(true)}
        >
          <ThemedText style={styles.floatingButtonText}>📸</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={() => setAddMealModalVisible(true)}
        >
          <ThemedText style={styles.floatingButtonText}>+</ThemedText>
        </TouchableOpacity>
      </View>

      <LoadingOverlay visible={isLoading} />
    </ThemedView>
  );
}