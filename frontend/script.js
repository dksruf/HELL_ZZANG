// 목표 영양소 기준값 설정 (고정값)
const goals = {
  calories: 3200, // 하루 목표 칼로리
  carbs: 150, // 하루 목표 탄수화물(g)
  protein: 200, // 하루 목표 단백질(g)
  fats: 200, // 하루 목표 지방(g)
};

// 현재까지 섭취한 영양소 값 (초기값)
let current = {
  calories: 0, // 현재 칼로리 섭취량
  carbs: 0, // 현재 탄수화물 섭취량(g)
  protein: 0, // 현재 단백질 섭취량(g)
  fats: 0, // 현재 지방 섭취량(g)
};

const foodTracker = {};

// 파일 선택 시 이미지 미리보기 기능
document
  .getElementById("imageInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0]; // 사용자가 선택한 첫 번째 파일 가져오기
    const preview = document.getElementById("preview"); // 미리보기 이미지 태그 가져오기

    if (file) {
      // 파일이 존재하면
      const reader = new FileReader(); // 파일 읽기 위한 FileReader 객체 생성
      reader.onload = function (e) {
        // 파일 읽기 완료 시 실행
        preview.src = e.target.result; // 이미지 미리보기 설정 (base64)
        preview.style.display = "block"; // 미리보기 이미지 보이기
      };
      reader.readAsDataURL(file); // 파일을 base64 URL로 읽기 시작
    }
  });

// 이미지 업로드 및 음식 정보 분석 함수
async function uploadImage() {
  const fileInput = document.getElementById("imageInput"); // 파일 입력 태그 가져오기

  if (!fileInput.files.length) {
    // 파일 선택 안 했을 경우
    alert("이미지를 선택하세요!"); // 경고창 표시
    return; // 함수 종료
  }

  const formData = new FormData(); // 폼 데이터 객체 생성
  formData.append("file", fileInput.files[0]); // 선택한 파일 추가

  try {
    // FastAPI 서버에 POST 요청으로 이미지 업로드
    const response = await fetch("http://127.0.0.1:8000/predict/", {
      method: "POST", // POST 방식
      body: formData, // 이미지 파일 포함
    });

    const data = await response.json(); // 서버 응답을 JSON으로 파싱

    // 서버 응답에 메시지가 있을 경우 (예: 영양 정보 없음)
    if (data.message) {
      alert(`${data.food} 분석 결과: ${data.message}`); // 알림 표시
    }

    if (foodTracker[data.food]) {
      foodTracker[data.food] += 1;
    } else {
      foodTracker[data.food] = 1;
    }

    updateFoodList();

    // 분석 결과를 HTML에 표시
    document.getElementById("foodName").textContent = data.food; // 음식 이름
    document.getElementById("calories").textContent = data.calories || "-"; // 칼로리
    document.getElementById("carbs").textContent = data.carbs || "-"; // 탄수화물
    document.getElementById("protein").textContent = data.protein || "-"; // 단백질
    document.getElementById("fat").textContent = data.fats || "-"; // 지방

    // 응답값 숫자로 변환 (빈 값 방지 위해 0으로 처리)
    const addCalories = parseFloat(data.calories) || 0;
    const addCarbs = parseFloat(data.carbs) || 0;
    const addProtein = parseFloat(data.protein) || 0;
    const addFats = parseFloat(data.fats) || 0;

    // 현재 섭취량에 음식 값 더하기
    current.calories += addCalories;
    current.carbs += addCarbs;
    current.protein += addProtein;
    current.fats += addFats;

    // 목표 표시 업데이트 함수 호출
    updateGoalsDisplay();
  } catch (error) {
    console.error("에러 발생:", error); // 콘솔에 에러 출력
    alert("이미지 분석 중 오류가 발생했습니다."); // 에러 알림
  }
}

function updateFoodList() {
  const foodList = document.getElementById("foodList");
  foodList.innerHTML = ""; // 기존 목록 초기화

  for (const [food, count] of Object.entries(foodTracker)) {
    if (count > 0) {
      const listItem = document.createElement("li");
      listItem.textContent = `${food} x${count}`;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "삭제";
      deleteButton.style.marginLeft = "10px";
      deleteButton.style.cursor = "pointer";
      deleteButton.onclick = function () {
        removeFood(food);
      };

      listItem.appendChild(deleteButton);
      foodList.appendChild(listItem);
    }
  }
}

function removeFood(food) {
  if (foodTracker[food] > 1) {
    foodTracker[food] -= 1;
  } else {
    delete foodTracker[food];
  }
  updateFoodList();
  updateGoalsAfterRemoval(food);
}
function updateGoalsAfterRemoval(food) {
  // 음식 데이터 가져오기 (이미 등록된 값에서 감소)
  const calories =
    parseFloat(document.getElementById("calories").textContent) || 0;
  const carbs = parseFloat(document.getElementById("carbs").textContent) || 0;
  const protein =
    parseFloat(document.getElementById("protein").textContent) || 0;
  const fats = parseFloat(document.getElementById("fat").textContent) || 0;

  current.calories -= calories;
  current.carbs -= carbs;
  current.protein -= protein;
  current.fats -= fats;

  if (current.calories < 0) current.calories = 0;
  if (current.carbs < 0) current.carbs = 0;
  if (current.protein < 0) current.protein = 0;
  if (current.fats < 0) current.fats = 0;

  updateGoalsDisplay();
}
// 목표 수치 및 체크박스 상태 업데이트 함수
function updateGoalsDisplay() {
  const goalSection = document.querySelector(".goal-section"); // 목표 영역 DOM 요소 가져오기
  const goalItems = goalSection.querySelectorAll(".goal-item"); // 각 목표 항목들 가져오기

  // 칼로리 값 및 체크박스 갱신
  goalItems[0].querySelector(
    "span"
  ).textContent = `kcal: ${current.calories} / ${goals.calories}`; // 현재/목표 표시
  goalItems[0].querySelector("input").checked =
    current.calories >= goals.calories; // 목표 달성 여부 체크

  // 탄수화물 값 및 체크박스 갱신
  goalItems[1].querySelector(
    "span"
  ).textContent = `carb.: ${current.carbs} / ${goals.carbs}`;
  goalItems[1].querySelector("input").checked = current.carbs >= goals.carbs;

  // 단백질 값 및 체크박스 갱신
  goalItems[2].querySelector(
    "span"
  ).textContent = `prot.: ${current.protein} / ${goals.protein}`;
  goalItems[2].querySelector("input").checked =
    current.protein >= goals.protein;

  // 지방 값 및 체크박스 갱신
  goalItems[3].querySelector(
    "span"
  ).textContent = `fat: ${current.fats} / ${goals.fats}`;
  goalItems[3].querySelector("input").checked = current.fats >= goals.fats;
}
