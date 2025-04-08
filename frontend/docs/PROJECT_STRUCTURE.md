# HELLZANG 프로젝트 구조

<!-- 
  프로젝트의 전체적인 구조와 각 파일의 역할을 설명하는 문서입니다.
  이 문서는 개발자들이 프로젝트를 이해하고 유지보수하는 데 도움이 됩니다.
-->

## 1. 주요 디렉토리 구조
<!-- 
  프로젝트의 기본적인 폴더 구조를 보여줍니다.
  각 폴더는 특정한 목적과 역할을 가지고 있습니다.
-->
```
HELLZANG/
├── app/                    # 앱의 메인 디렉토리
│   └── (tabs)/            # 탭 네비게이션 관련 파일들
├── components/            # 재사용 가능한 UI 컴포넌트들
├── models/               # 데이터 모델 클래스들
├── services/             # 비즈니스 로직 서비스들
└── docs/                 # 프로젝트 문서
```

## 2. 주요 파일 설명

### 2.1 모델 클래스들 (`models/`)
<!-- 
  데이터 모델 클래스들은 애플리케이션의 핵심 데이터 구조를 정의합니다.
  각 클래스는 특정 도메인의 데이터와 관련된 로직을 캡슐화합니다.
-->
- `Macro.ts`: 영양소(단백질, 탄수화물, 지방) 정보를 관리하는 클래스
  - 주요 속성: name, current, total, unit, color
  - 주요 메서드: getPercentage(), addAmount(), subtractAmount()

- `Meal.ts`: 식사 정보를 관리하는 클래스
  - 주요 속성: name, calories, time, protein, carbs, fat, grams
  - 주요 메서드: calculateActualCalories(), calculateActualProtein(), calculateActualCarbs(), calculateActualFat()

### 2.2 서비스 클래스들 (`services/`)
<!-- 
  서비스 클래스들은 비즈니스 로직을 처리합니다.
  데이터 모델과 UI 컴포넌트 사이의 중간 계층 역할을 합니다.
-->
- `NutritionTracker.ts`: 영양소 추적을 관리하는 핵심 서비스 클래스
  - 주요 속성: macros, recentMeals, savedFoods, totalCalories
  - 주요 메서드:
    - addMeal(), removeMeal(): 식사 추가/삭제
    - saveFood(), removeSavedFood(): 음식 저장/삭제
    - getMacros(), getRecentMeals(), getSavedFoods(): 데이터 조회
    - setTotalCalories(), setMacros(): 설정 변경
    - getCaloriesLeft(), getCaloriePercentage(): 칼로리 계산

### 2.3 UI 컴포넌트들 (`components/`)
<!-- 
  UI 컴포넌트들은 사용자 인터페이스를 구성하는 재사용 가능한 요소들입니다.
  각 컴포넌트는 특정한 시각적 요소나 기능을 담당합니다.
-->
- `CircularProgress.tsx`: 원형 프로그레스바 컴포넌트
- `MacroProgress.tsx`: 영양소 진행 상태 표시 컴포넌트
- `MealCard.tsx`: 식사 정보 카드 컴포넌트
- `ThemedText.tsx`: 테마가 적용된 텍스트 컴포넌트
- `ThemedView.tsx`: 테마가 적용된 뷰 컴포넌트

### 2.4 메인 화면 (`app/(tabs)/index.tsx`)
<!-- 
  메인 화면은 앱의 중심이 되는 화면입니다.
  다양한 기능들이 통합되어 있으며, 사용자와의 상호작용이 가장 많이 일어나는 부분입니다.
-->
- 앱의 메인 화면 구현
- 주요 기능:
  - 칼로리 및 영양소 추적
  - 식사 추가/삭제
  - 목표 설정
  - 음식 분석
  - 저장된 음식 관리

## 3. 데이터 흐름
<!-- 
  데이터 흐름은 애플리케이션에서 데이터가 어떻게 이동하고 처리되는지를 보여줍니다.
  이는 코드의 구조와 의존성을 이해하는 데 중요한 부분입니다.
-->
1. 사용자 입력 → `index.tsx`에서 이벤트 처리
2. `NutritionTracker` 서비스로 데이터 전달
3. `Macro`와 `Meal` 모델을 통해 데이터 관리
4. UI 컴포넌트들을 통해 사용자에게 표시

## 4. 주요 상수값
<!-- 
  주요 상수값들은 애플리케이션에서 자주 사용되는 고정된 값들입니다.
  이 값들은 한 곳에서 관리되어 일관성을 유지하고 변경을 용이하게 합니다.
-->

### 영양소별 칼로리 (NUTRIENT_CALORIES)
- 탄수화물: 4kcal/g
- 단백질: 4kcal/g
- 지방: 9kcal/g

### 영양소 비율 (NUTRIENT_RATIO)
- 탄수화물: 50% (5)
- 단백질: 30% (3)
- 지방: 20% (2)

## 5. 초기 설정값
<!-- 
  초기 설정값들은 애플리케이션이 처음 시작될 때 사용되는 기본값들입니다.
  이 값들은 사용자가 설정을 변경할 때까지 유지됩니다.
-->
- 기본 칼로리: 2000kcal
- 초기 영양소 목표:
  - 단백질: 150g
  - 탄수화물: 250g
  - 지방: 44g 