/**
 * HELLZANG 앱의 메인 화면 컴포넌트
 * 
 * 이 파일은 앱의 메인 화면을 구현하며, 다음과 같은 주요 기능을 포함합니다:
 * 1. 칼로리 및 영양소 추적
 * 2. 식사 추가/삭제
 * 3. 목표 설정
 * 4. 음식 분석
 * 5. 저장된 음식 관리
 * 
 * 주요 컴포넌트:
 * - SettingsModal: 목표 칼로리와 영양소 비율 설정
 * - CustomAlert: 사용자에게 알림을 표시
 * - FoodAnalysisModal: 음식 분석 결과를 표시
 * - CircularProgress: 원형 프로그레스바로 진행 상태 표시
 * 
 * 데이터 흐름:
 * 1. 사용자 입력 → 이벤트 핸들러
 * 2. NutritionTracker 서비스로 데이터 전달
 * 3. Macro와 Meal 모델을 통해 데이터 관리
 * 4. UI 컴포넌트들을 통해 사용자에게 표시
 */

// ============= React Native의 기본 컴포넌트들을 임포트 =============
// React Native의 기본 UI 컴포넌트들과 유틸리티를 가져옴
import { Button, StyleSheet, View, ScrollView, TouchableOpacity, Modal, TextInput, Image, Platform, Linking, Text, ActivityIndicator } from 'react-native';

// 테마가 적용된 텍스트 컴포넌트 - 앱 전체의 일관된 텍스트 스타일링을 위해 사용
import { ThemedText } from '../../components/ThemedText';

// 테마가 적용된 뷰 컴포넌트 - 앱 전체의 일관된 배경색과 스타일링을 위해 사용
import { ThemedView } from '../../components/ThemedView';

// SVG 그래픽을 그리기 위한 컴포넌트들 - 원형 프로그레스 바 구현에 사용
import Svg, { Circle } from 'react-native-svg';

// React와 상태 관리 훅을 가져옴
import React ,{ useState, useEffect } from 'react';

// Expo Router의 네비게이션 관련 훅들 - 페이지 간 이동과 파라미터 전달에 사용
import { useLocalSearchParams, router } from 'expo-router';

// 원형 프로그레스 바 컴포넌트 - 칼로리 진행도를 시각적으로 표시
import { CircularProgress as CircularProgressComponent } from '../../components/CircularProgress';

// 영양소 진행도를 표시하는 컴포넌트 - 단백질, 탄수화물, 지방의 섭취량 표시
import { MacroProgress } from '../../components/MacroProgress';

// 식사 정보를 표시하는 카드 컴포넌트 - 개별 식사 항목을 표시
import { MealCard } from '../../components/MealCard';

// 영양소 데이터 모델 - 단백질, 탄수화물, 지방 등의 영양소 정보 관리
import { Macro } from '../../models/Macro';

// 식사 데이터 모델 - 개별 식사의 정보(이름, 칼로리, 영양소 등) 관리
import { Meal } from '../../models/Meal';

// 영양소 추적 서비스 - 전체 칼로리와 영양소 섭취량을 관리하고 계산
import { NutritionTracker } from '../../services/NutritionTracker';
import { apiService } from '../../services/api';

// Expo의 이미지 선택/촬영 기능 - 카메라로 음식 사진 촬영에 사용
import * as ImagePicker from 'expo-image-picker';

// 음식 분석 컴포넌트 - 촬영한 음식 사진을 분석하여 영양정보를 추출
import FoodAnalysis from '../../components/FoodAnalysis';


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
  healthScore: number;
}

// ============= 영양소별 칼로리 상수 =============
const NUTRIENT_CALORIES = {
  CARBS: 4,    // 4kcal/g
  PROTEIN: 4,  // 4kcal/g
  FAT: 9,      // 9kcal/g
};

// ============= 영양소 비율 상수 =============
const NUTRIENT_RATIO = {
  CARBS: 5,    // 50%
  PROTEIN: 3,  // 30%
  FAT: 2,      // 20%
};

// ============= NutritionTracker 인스턴스 생성 =============
const initialMacros = [
  new Macro('Protein', 0, 150, 'g', '#FF6B6B'),  // (2000kcal * 0.3) / 4kcal = 150g
  new Macro('Carbs', 0, 250, 'g', '#FFB169'),    // (2000kcal * 0.5) / 4kcal = 250g
  new Macro('Fat', 0, 44, 'g', '#4DABF7'),       // (2000kcal * 0.2) / 9kcal = 44.4g ≈ 44g
];

const tracker = new NutritionTracker(2000, initialMacros);

// ============= 원형 프로그레스바 컴포넌트 =============
const CircularProgress = ({ percentage, size, strokeWidth, color }: { percentage: number, size: number, strokeWidth: number, color: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = ((100 - percentage) / 100) * circumference;

  // 색상을 RGB로 분해하여 배경 색상을 더 연하게 만듦
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgb = hexToRgb(color);
  const backgroundColor = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)` : color;

  return (
    <Svg width={size} height={size}>
      {/* 배경 원 */}
      <Circle
        stroke={backgroundColor}
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
      />
      {/* 진행도 원 */}
      <Circle
        stroke={color}
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={progress}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
};

// ============= 설정 모달 컴포넌트 =============
const SettingsModal = ({ visible, onClose, onSave, currentValues }: SettingsModalProps) => {
  const [targetCalories, setTargetCalories] = useState(currentValues.totalCalories.toString());

  const calculateMacros = (calories: number) => {
    // 전체 비율 계산 (5:4:1)
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

  const handleSave = () => {
    const calories = parseInt(targetCalories);
    const macros = calculateMacros(calories);
    
    onSave({
      totalCalories: calories,
      macros: [
        new Macro('Protein', currentValues.macros[0].current, macros.protein, 'g', '#FF6B6B'),
        new Macro('Carbs', currentValues.macros[1].current, macros.carbs, 'g', '#FFB169'),
        new Macro('Fat', currentValues.macros[2].current, macros.fat, 'g', '#4DABF7'),
      ]
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalTitle}>목표 설정</ThemedText>
          
          <View style={styles.inputContainer}>
            <ThemedText>목표 칼로리 (kcal)</ThemedText>
            <TextInput
              style={styles.input}
              value={targetCalories}
              onChangeText={setTargetCalories}
              keyboardType="numeric"
              placeholder="예: 2000"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <ThemedText style={styles.buttonText}>취소</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <ThemedText style={styles.buttonText}>저장</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ============= 커스텀 알람 모달 컴포넌트 =============
const CustomAlert = ({ 
  visible, 
  title, 
  message, 
  onClose 
}: { 
  visible: boolean; 
  title: string; 
  message: string; 
  onClose: () => void; 
}) => {
  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.alertOverlay}>
        <View style={styles.alertContainer}>
          <View style={styles.alertHeader}>
            <ThemedText style={styles.alertTitle}>{title}</ThemedText>
          </View>
          <View style={styles.alertBody}>
            <ThemedText style={styles.alertMessage}>{message}</ThemedText>
          </View>
          <View style={styles.alertFooter}>
            <TouchableOpacity 
              style={styles.alertButton}
              onPress={onClose}
            >
              <ThemedText style={styles.alertButtonText}>확인</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ============= 음식 분석 결과 모달 컴포넌트 =============
interface FoodAnalysisModalProps {
  visible: boolean;
  onClose: () => void;
  onFixResults: () => void;
  imageUri?: string;
  foodData: AnalyzedFoodData;
}

//=============================================사진 찍고 나서의 화면=============================================
const FoodAnalysisModal = ({ 
  visible, 
  onClose, 
  onFixResults, 
  imageUri, 
  foodData 
}: FoodAnalysisModalProps) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleDone = () => {
    // 현재 수량을 반영한 영양소 계산
    const meal = Meal.fromFormData(
      foodData.name,
      Math.round(foodData.calories * quantity),
      Math.round(foodData.protein * quantity),
      Math.round(foodData.carbs * quantity),
      Math.round(foodData.fats * quantity),
      100 * quantity,  // 기본 100g 단위로 설정
      imageUri  // 이미지 URI 추가
    );

    // 트래커에 식사 추가
    tracker.addMeal(meal);
    // 식사를 저장된 음식 목록에도 추가
    tracker.saveFood(meal);
    
    // 모달 닫기
    onClose();
    // 수량 초기화
    setQuantity(1);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.analysisOverlay}>
        <ScrollView style={styles.analysisContainer}>
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={styles.foodImage}
              resizeMode="cover"
            />
          )}
          
          <View style={styles.foodInfoContainer}>
            <View style={styles.foodNameContainer}>
              <ThemedText style={styles.foodName}>{foodData.name}</ThemedText>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
                  <ThemedText style={styles.quantityButtonText}>-</ThemedText>
                </TouchableOpacity>
                <ThemedText style={styles.quantityText}>{quantity}</ThemedText>
                <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
                  <ThemedText style={styles.quantityButtonText}>+</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.nutritionContainer}>
              <View style={styles.calorieContainer}>
                <ThemedText style={styles.calorieIcon}>🔥</ThemedText>
                <ThemedText style={styles.calorieText}>{foodData.calories * quantity}</ThemedText>
              </View>

              <View style={styles.analysisModalMacrosContainer}>
                <View style={styles.analysisModalMacroItem}>
                  <ThemedText style={styles.macroIcon}>🥩</ThemedText>
                  <ThemedText style={styles.macroLabel}>Protein</ThemedText>
                  <ThemedText style={styles.analysisModalMacroValue}>{foodData.protein * quantity}g</ThemedText>
                </View>
                <View style={styles.analysisModalMacroItem}>
                  <ThemedText style={styles.macroIcon}>🌾</ThemedText>
                  <ThemedText style={styles.macroLabel}>Carbs</ThemedText>
                  <ThemedText style={styles.analysisModalMacroValue}>{foodData.carbs * quantity}g</ThemedText>
                </View>
                <View style={styles.analysisModalMacroItem}>
                  <ThemedText style={styles.macroIcon}>🥑</ThemedText>
                  <ThemedText style={styles.macroLabel}>Fats</ThemedText>
                  <ThemedText style={styles.analysisModalMacroValue}>{foodData.fats * quantity}g</ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.analysisModalButtonContainer}>
              <TouchableOpacity style={styles.fixButton} onPress={onFixResults}>
                <ThemedText style={styles.fixButtonText}>Fix Results</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
                <ThemedText style={styles.doneButtonText}>Done</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};


//=============================================사진 찍고 나서의 화면=============================================





// ============= HomeScreen 컴포넌트 정의 =============
export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [addOptionsVisible, setAddOptionsVisible] = useState(false);
  const [savedFoodsVisible, setSavedFoodsVisible] = useState(false);
  const [describeFoodVisible, setDescribeFoodVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // 음식 입력 관련 상태
  const [foodName, setFoodName] = useState('');
  const [foodCalories, setFoodCalories] = useState('');
  const [foodProtein, setFoodProtein] = useState('');
  const [foodCarbs, setFoodCarbs] = useState('');
  const [foodFat, setFoodFat] = useState('');
  const [foodGrams, setFoodGrams] = useState('');
  
  // 알림 관련 상태
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  
  // 이미지 분석 관련 상태
  const [analysisModalVisible, setAnalysisModalVisible] = useState(false);
  const [currentImageUri, setCurrentImageUri] = useState<string | undefined>();
  const [analyzedFoodData, setAnalyzedFoodData] = useState<AnalyzedFoodData>({
    name: '',
    quantity: 1,
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    healthScore: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fixResultsVisible, setFixResultsVisible] = useState(false);
  const [editingFood, setEditingFood] = useState<AnalyzedFoodData>({
    name: '',
    quantity: 1,
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    healthScore: 0,
  });
  const [editingExistingMeal, setEditingExistingMeal] = useState(false);
  const [editingMealIndex, setEditingMealIndex] = useState(-1);

  const params = useLocalSearchParams<{ imageUri?: string }>();

  useEffect(() => {
    if (params.imageUri) {
      // 카메라에서 전달받은 이미지 URI로 분석 모달 표시
      setCurrentImageUri(params.imageUri);
      setAnalysisModalVisible(true);
      // 임시 분석 데이터 설정 (실제로는 API 호출 필요)
      setAnalyzedFoodData({
        name: '음식',
        quantity: 1,
        calories: 300,
        protein: 10,
        carbs: 40,
        fats: 12,
        healthScore: 7.5
      });
    }
  }, [params.imageUri]);

  // 섭취한 칼로리 계산
  const caloriePercentage = tracker.getCaloriePercentage();
  const caloriesLeft = tracker.getCaloriesLeft();
  const macros = tracker.getMacros();
  const totalCalories = tracker.totalCalories;
  const consumedCalories = totalCalories - caloriesLeft;

  const handleSettingsSave = (newSettings: { totalCalories: number; macros: Macro[] }) => {
    tracker.setTotalCalories(newSettings.totalCalories);
    tracker.setMacros(newSettings.macros);
    setModalVisible(false);
  };

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  // 저장된 음식 목록 표시
  const openSavedFoods = () => {
    setAddOptionsVisible(false);
    setSavedFoodsVisible(true);
  };

  // 음식 설명 입력 모달 표시
  const openDescribeFood = () => {
    setAddOptionsVisible(false);
    setDescribeFoodVisible(true);
  };

  // 음식 추가 처리 함수
  const handleAddFood = () => {
    if (!foodName || !foodCalories || !foodProtein || !foodCarbs || !foodFat || !foodGrams) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const meal = Meal.fromFormData(
      foodName,
      parseInt(foodCalories),
      parseInt(foodProtein),
      parseInt(foodCarbs),
      parseInt(foodFat),
      parseInt(foodGrams)
    );

    tracker.addMeal(meal);
    tracker.saveFood(meal);

    // 입력 필드 초기화
    setFoodName('');
    setFoodCalories('');
    setFoodProtein('');
    setFoodCarbs('');
    setFoodFat('');
    setFoodGrams('');
    setDescribeFoodVisible(false);
  };

  // 음식 삭제 처리 함수
  const handleDeleteMeal = (index: number) => {
    try {
      tracker.removeMeal(index);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('음식 삭제 중 오류 발생:', error);
      showAlert('오류', '음식을 삭제하는 중 오류가 발생했습니다.');
    }
  };

  // 저장된 음식 삭제 처리 함수
  const handleDeleteSavedFood = (index: number) => {
    tracker.removeSavedFood(index);
  };

  const handleFixResults = () => {
    setEditingFood(analyzedFoodData);
    setAnalysisModalVisible(false);
    setFixResultsVisible(true);
  };

  const handleSaveFixResults = () => {
    setAnalyzedFoodData(editingFood);
    setFixResultsVisible(false);
    
    // If we're editing an existing meal, update it
    if (editingExistingMeal) {
      // Update the meal in the tracker
      // You'll need to implement this functionality in your NutritionTracker class
      tracker.updateMeal(editingMealIndex, Meal.fromFormData(
        editingFood.name,
        editingFood.calories,
        editingFood.protein,
        editingFood.carbs,
        editingFood.fats,
        editingFood.quantity * 100, // Convert quantity back to grams
        currentImageUri
      ));
      setEditingExistingMeal(false);
      setEditingMealIndex(-1);
    } else {
      // Show the analysis modal for new meals
      setAnalysisModalVisible(true);
    }
  };

  // FastAPI 서버 테스트 함수
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

  // FastAPI 서버로 이미지를 전송하고 영양 정보를 받아오는 함수
  const analyzeFoodImage = async (imageUri: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await apiService.analyzeFoodImage(imageUri);
      
      console.log('서버 응답 데이터:', data); // 디버깅을 위한 로그 추가
      
      // 서버에서 받은 데이터로 상태 업데이트
      setAnalyzedFoodData({
        name: data.food || '음식', // 'food' 키로 음식 이름을 받아옴
        quantity: 1,
        calories: data.calories || 0,
        protein: data.protein || 0,
        carbs: data.carbs || 0,
        fats: data.fats || 0,
        healthScore: data.healthScore || 0,
      });
      
      // 분석 모달 표시
      setAnalysisModalVisible(true);
    } catch (err) {
      console.error('이미지 분석 오류:', err);
      setError('이미지 분석 중 오류가 발생했습니다.');
      showAlert('오류', '이미지 분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container} key={refreshKey}>
      <SettingsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSettingsSave}
        currentValues={{
          totalCalories: tracker.totalCalories,
          macros: tracker.getMacros()
        }}
      />

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />

      <FoodAnalysisModal
        visible={analysisModalVisible}
        onClose={() => setAnalysisModalVisible(false)}
        onFixResults={handleFixResults}
        imageUri={currentImageUri}
        foodData={analyzedFoodData}
      />

      {/* ============= 음식 분석 결과 수정 모달 ============= */}
      <Modal
        visible={fixResultsVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setFixResultsVisible(false);
          setEditingExistingMeal(false);
          setEditingMealIndex(-1);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.describeFoodModal]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>분석 결과 수정</ThemedText>
              <TouchableOpacity 
                style={styles.closeButtonContainer}
                onPress={() => {
                  setFixResultsVisible(false);
                  setEditingExistingMeal(false);
                  setEditingMealIndex(-1);
                }}
              >
                <ThemedText style={styles.closeButton}>✕</ThemedText>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.describeFoodContent}>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>음식 이름</ThemedText>
                <TextInput
                  style={styles.largeInput}
                  placeholder="예: 치킨 샐러드"
                  placeholderTextColor="#999"
                  value={editingFood.name}
                  onChangeText={(text) => setEditingFood({...editingFood, name: text})}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>칼로리 (kcal)</ThemedText>
                <TextInput
                  style={styles.largeInput}
                  placeholder="예: 350"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                  value={editingFood.calories.toString()}
                  onChangeText={(text) => setEditingFood({...editingFood, calories: Number(text) || 0})}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>영양소 정보</ThemedText>
                <View style={styles.macroInputWrapper}>
                  <View style={styles.macroInputItem}>
                    <ThemedText style={styles.macroInputLabel}>
                      <ThemedText style={styles.macroIcon}>🥩 </ThemedText>
                      단백질 (g)
                    </ThemedText>
                    <TextInput
                      style={styles.largeInput}
                      placeholder="25"
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                      value={editingFood.protein.toString()}
                      onChangeText={(text) => setEditingFood({...editingFood, protein: Number(text) || 0})}
                    />
                  </View>
                  <View style={styles.macroInputItem}>
                    <ThemedText style={styles.macroInputLabel}>
                      <ThemedText style={styles.macroIcon}>🌾 </ThemedText>
                      탄수화물 (g)
                    </ThemedText>
                    <TextInput
                      style={styles.largeInput}
                      placeholder="30"
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                      value={editingFood.carbs.toString()}
                      onChangeText={(text) => setEditingFood({...editingFood, carbs: Number(text) || 0})}
                    />
                  </View>
                  <View style={styles.macroInputItem}>
                    <ThemedText style={styles.macroInputLabel}>
                      <ThemedText style={styles.macroIcon}>🥑 </ThemedText>
                      지방 (g)
                    </ThemedText>
                    <TextInput
                      style={styles.largeInput}
                      placeholder="10"
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                      value={editingFood.fats.toString()}
                      onChangeText={(text) => setEditingFood({...editingFood, fats: Number(text) || 0})}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.footerButton, styles.cancelButton]} 
                onPress={() => {
                  setFixResultsVisible(false);
                  setEditingExistingMeal(false);
                  setEditingMealIndex(-1);
                }}
              >
                <ThemedText style={styles.buttonText}>취소</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.footerButton, styles.saveButton]}
                onPress={handleSaveFixResults}
              >
                <ThemedText style={styles.buttonText}>
                  {editingExistingMeal ? '수정' : '저장'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============= 상단 헤더 ============= */}
      <View style={styles.header}>
        <ThemedText style={styles.appTitle}>HELLZANG</ThemedText>
      </View>

      <ScrollView style={styles.content}>
        {/* ============= 칼로리 카드 ============= */}
        <View style={styles.calorieCard}>
          <View style={styles.calorieContentContainer}>
            <View style={styles.calorieLeftInfo}>
            </View>

            <View style={styles.circularProgressContainer}>
              <CircularProgressComponent
                percentage={caloriePercentage}
                size={200}
                strokeWidth={15}
                color="#4CAF50"
              />
              <View style={styles.calorieTextContainer}>
                <ThemedText style={styles.calorieNumber}>{consumedCalories}kcal</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* ============= 영양소 카드 ============= */}
        <View style={styles.macrosCard}>
          <View style={styles.macrosContainer}>
            {tracker.getMacros().map((macro, index) => (
              <MacroProgress key={index} macro={macro} />
            ))}
          </View>
        </View>

        {/* ============= 최근 업로드 섹션 ============= */}
        <View style={styles.recentSection}>
          <ThemedText style={styles.sectionTitle}>Recently uploaded</ThemedText>
          {tracker.getRecentMeals().map((meal, index) => (
            <MealCard
              key={index}
              meal={meal}
              onDelete={() => handleDeleteMeal(index)}
              onEdit={() => {
                setEditingExistingMeal(true);
                setEditingMealIndex(index);
                const updatedFoodData = {
                  name: meal.name,
                  quantity: meal.grams / 100,
                  calories: meal.calories,
                  protein: meal.protein,
                  carbs: meal.carbs,
                  fats: meal.fat,
                  healthScore: 0,
                };
                setAnalyzedFoodData(updatedFoodData);
                setEditingFood(updatedFoodData);
                setCurrentImageUri(meal.imageUri);
                setFixResultsVisible(true);
              }}
            />
          ))}
        </View>
      </ScrollView>

      {/* ============= 하단 플로팅 버튼 ============= */}
      <View style={styles.floatingButtonContainer}>
        {/* 테스트 버튼 */}
        <TouchableOpacity 
          style={[styles.floatingButton, styles.testButton]}
          onPress={testServerConnection}
        >
          <ThemedText style={styles.floatingButtonText}>🔍</ThemedText>
        </TouchableOpacity>
        
        {/* 카메라 버튼 */}
        <TouchableOpacity 
          style={[styles.floatingButton, styles.cameraButton]}
          onPress={() => {
            // 카메라 실행
            const pickImageAsync = async () => {
              let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
              });
              
              if (!result.canceled) {
                // 이미지 촬영 후 분석 모달 표시
                setCurrentImageUri(result.assets[0].uri);
                // FastAPI 서버로 이미지 전송 및 분석
                await analyzeFoodImage(result.assets[0].uri);
              }
            };
            
            pickImageAsync();
          }}
        >
          <ThemedText style={styles.floatingButtonText}>📸</ThemedText>
        </TouchableOpacity>
        
        {/* 추가 버튼 */}
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={() => setAddOptionsVisible(true)}
        >
          <ThemedText style={styles.floatingButtonText}>+</ThemedText>
        </TouchableOpacity>
      </View>

      {/* ============= 추가 옵션 모달 ============= */}
      <Modal
        visible={addOptionsVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setAddOptionsVisible(false)}
      >
        <TouchableOpacity 
          style={styles.addOptionsOverlay}
          activeOpacity={1}
          onPress={() => setAddOptionsVisible(false)}
        >
          <TouchableOpacity 
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.addOptionsContainer}>
              <View style={styles.addOptionsGrid}>
                <TouchableOpacity 
                  style={[styles.addOptionBox, { borderTopLeftRadius: 20, borderTopRightRadius: 20 }]}
                  onPress={() => {
                    setAddOptionsVisible(false);
                    openDescribeFood();
                  }}
                >
                  <ThemedText style={styles.addOptionIcon}>✏️</ThemedText>
                  <ThemedText style={styles.addOptionText}>직접 입력</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.addOptionBox}
                  onPress={openSavedFoods}
                >
                  <ThemedText style={styles.addOptionIcon}>📋</ThemedText>
                  <ThemedText style={styles.addOptionText}>저장된 음식</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.addOptionBox, { borderBottomWidth: 0, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }]}
                  onPress={() => {
                    setAddOptionsVisible(false);
                    setModalVisible(true);
                  }}
                >
                  <ThemedText style={styles.addOptionIcon}>⚙️</ThemedText>
                  <ThemedText style={styles.addOptionText}>목표 설정</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ============= 저장된 음식 목록 모달 ============= */}
      <Modal
        visible={savedFoodsVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSavedFoodsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>저장된 음식</ThemedText>
              <TouchableOpacity onPress={() => setSavedFoodsVisible(false)}>
                <ThemedText style={styles.closeButton}>✕</ThemedText>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.savedFoodsList}>
              {tracker.getSavedFoods().length > 0 ? (
                tracker.getSavedFoods().map((meal, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.savedFoodItem}
                    onPress={() => {
                      tracker.addMeal(meal);
                      setSavedFoodsVisible(false);
                    }}
                  >
                    <MealCard
                      meal={meal}
                      onDelete={() => handleDeleteSavedFood(index)}
                    />
                  </TouchableOpacity>
                ))
              ) : (
                <ThemedText style={styles.emptyListText}>저장된 음식이 없습니다.</ThemedText>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ============= 음식 설명 입력 모달 ============= */}
      <Modal
        visible={describeFoodVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDescribeFoodVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.describeFoodModal]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>음식 추가</ThemedText>
              <TouchableOpacity 
                style={styles.closeButtonContainer}
                onPress={() => setDescribeFoodVisible(false)}
              >
                <ThemedText style={styles.closeButton}>✕</ThemedText>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.describeFoodContent}>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>음식 이름</ThemedText>
                <TextInput
                  style={styles.largeInput}
                  placeholder="예: 치킨 샐러드"
                  placeholderTextColor="#999"
                  value={foodName}
                  onChangeText={setFoodName}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>100g 당 칼로리 (kcal)</ThemedText>
                <TextInput
                  style={styles.largeInput}
                  placeholder="예: 350"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                  value={foodCalories}
                  onChangeText={setFoodCalories}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>영양소 정보 (100g 당)</ThemedText>
                <View style={styles.macroInputWrapper}>
                  <View style={styles.macroInputItem}>
                    <ThemedText style={styles.macroInputLabel}>
                      <ThemedText style={styles.macroIcon}>🥩 </ThemedText>
                      단백질 (g)
                    </ThemedText>
                    <TextInput
                      style={styles.largeInput}
                      placeholder="25"
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                      value={foodProtein}
                      onChangeText={setFoodProtein}
                    />
                  </View>
                  <View style={styles.macroInputItem}>
                    <ThemedText style={styles.macroInputLabel}>
                      <ThemedText style={styles.macroIcon}>🌾 </ThemedText>
                      탄수화물 (g)
                    </ThemedText>
                    <TextInput
                      style={styles.largeInput}
                      placeholder="30"
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                      value={foodCarbs}
                      onChangeText={setFoodCarbs}
                    />
                  </View>
                  <View style={styles.macroInputItem}>
                    <ThemedText style={styles.macroInputLabel}>
                      <ThemedText style={styles.macroIcon}>🥑 </ThemedText>
                      지방 (g)
                    </ThemedText>
                    <TextInput
                      style={styles.largeInput}
                      placeholder="10"
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                      value={foodFat}
                      onChangeText={setFoodFat}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>섭취량 (g)</ThemedText>
                <TextInput
                  style={styles.largeInput}
                  placeholder="예: 150"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                  value={foodGrams}
                  onChangeText={setFoodGrams}
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.footerButton, styles.cancelButton]} 
                onPress={() => setDescribeFoodVisible(false)}
              >
                <ThemedText style={styles.buttonText}>취소</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.footerButton, styles.saveButton]}
                onPress={handleAddFood}
              >
                <ThemedText style={styles.buttonText}>저장</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 로딩 인디케이터 */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <ThemedText style={styles.loadingText}>이미지 분석 중...</ThemedText>
        </View>
      )}
    </ThemedView>
  );
}




// ============= 스타일 정의 =============
const styles = StyleSheet.create({
  // ============= 기본 컨테이너 스타일 =============
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 6,
    paddingTop: 25,
    paddingBottom: 2,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
  },

  // ============= 칼로리 카드 스타일 =============
  calorieCard: {
    backgroundColor: 'white',
    margin: 15,
    marginBottom: 10,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  calorieContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  calorieLeftInfo: {
    display: 'none',
  },
  circularProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  calorieTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  calorieNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },

  // ============= 영양소 카드 스타일 =============
  macrosCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  macroItem: {
    alignItems: 'center',
    width: '30%',
  },
  macroCircleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  macroValueContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  macroCurrent: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  macroValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
    marginTop: 4,
  },

  // ============= 최근 업로드 섹션 스타일 =============
  recentSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#000',
  },

  // ============= 식사 카드 스타일 =============
  mealCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  mealImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#E9ECEF',
    borderRadius: 10,
  },
  mealNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mealName: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    color: '#000',
  },
  mealGrams: {
    fontSize: 12,
    color: '#666',
  },
  mealTime: {
    fontSize: 14,
    color: '#000',
    marginTop: 4,
    marginBottom: 4,
  },
  macroTags: {
    flexDirection: 'row',
    gap: 8,
  },
  macroTag: {
    fontSize: 12,
    color: '#000',
  },
  mealRightSection: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  calorieDeleteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  deleteButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#666',
  },

  // ============= 설정 버튼 스타일 =============
  settingsButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#2C3E50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
    minWidth: 100,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },

  // ============= 플로팅 버튼 스타일 =============
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 15,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    gap: 10,
  },
  floatingButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  cameraButton: {
    backgroundColor: '#4CAF50',
  },
  testButton: {
    backgroundColor: '#FF9800',
  },
  floatingButtonText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: '600',
  },

  // ============= 모달 공통 스타일 =============
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    fontSize: 20,
    color: '#000',
  },
  closeButtonContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ============= 입력 필드 스타일 =============
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#000',
  },
  largeInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },

  // ============= 버튼 스타일 =============
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#DDD',
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: '600',
  },

  // ============= 저장된 음식 목록 스타일 =============
  savedFoodsList: {
    maxHeight: '110%',
  },
  savedFoodItem: {
    backgroundColor: '#F8F9FA',
    padding: 0,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  emptyListText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  savedFoodRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // ============= 영양소 입력 스타일 =============
  macroInputWrapper: {
    marginTop: 10,
  },
  macroInputItem: {
    marginBottom: 15,
  },
  macroInputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#000',
  },

  // ============= 모달 푸터 스타일 =============
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6C757D',
  },

  // ============= 추가 옵션 모달 스타일 =============
  addOptionsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  addOptionsContainer: {
    position: Platform.OS === 'web' ? 'relative' : 'absolute',
    bottom: Platform.OS === 'web' ? 20 : 80,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    width: Platform.OS === 'web' ? '80%' : '90%',
    maxWidth: Platform.OS === 'web' ? 400 : '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: Platform.OS === 'web' ? 30 : 0,
  },
  addOptionsGrid: {
    flexDirection: 'column',
  },
  addOptionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  addOptionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  addOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },

  // ============= 알림 모달 스타일 =============
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '80%',
    overflow: 'hidden',
  },
  alertHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  alertBody: {
    padding: 20,
    alignItems: 'center',
  },
  alertMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  alertFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  alertButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  alertButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // ============= 음식 분석 모달 스타일 =============
  analysisOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  analysisContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    width: '100%',
  },
  foodImage: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  foodInfoContainer: {
    padding: 20,
  },
  foodNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  foodName: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    color: '#000',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 8,
  },
  quantityButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 17.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  quantityButtonText: {
    fontSize: 24,
    color: '#000',
    fontWeight: '500',
    includeFontPadding: false,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 15,
    color: '#000',
  },
  nutritionContainer: {
    marginBottom: 20,
  },
  calorieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  calorieIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  calorieText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  analysisModalMacrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  analysisModalMacroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  macroLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  analysisModalMacroValue: { 
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  analysisModalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    padding: 20,
    paddingTop: 0,
  },
  fixButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    alignItems: 'center',
  },
  fixButtonText: {
    fontSize: 16,
    color: '#000',
  },
  doneButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#000',
    borderRadius: 10,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    color: '#FFF',
  },

  // ============= 음식 설명 모달 스타일 =============
  describeFoodModal: {
    width: '95%',
    maxHeight: '95%',
    paddingHorizontal: 15,
    paddingTop: 0,
    paddingBottom: 80,
  },
  describeFoodContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  // 로딩 오버레이 스타일
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FFF',
  },
});