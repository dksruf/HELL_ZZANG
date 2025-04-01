let analyzedData = null;

function getMealFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const meal = urlParams.get("meal");
    console.log("Meal from URL:", meal);
    return meal;
}

function goBack() {
    console.log("Returning to index.html");
    window.location.href = "index.html";
}

// 페이지 로드 시 음식 목록 가져오기
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://127.0.0.1:8000/foods/");
        const data = await response.json();
        const foodSelect = document.getElementById("foodSelect");

        data.foods.forEach(food => {
            const option = document.createElement("option");
            option.value = food;
            option.textContent = food;
            foodSelect.appendChild(option);
        });
    } catch (error) {
        console.error("음식 목록 가져오기 실패:", error);
        alert("음식 목록을 불러오지 못했습니다.");
    }
});

// 이미지 선택 시 미리보기 및 분석 버튼 표시
document.getElementById("imageInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById("preview");
    const analyzeButton = document.getElementById("analyzeButton");

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = "block";
            analyzeButton.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

// 이미지 업로드 및 분석
async function uploadImage() {
    const fileInput = document.getElementById("imageInput");

    if (!fileInput.files.length) {
        alert("이미지를 선택하세요!");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const response = await fetch("http://127.0.0.1:8000/predict/", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (data.message) {
            alert(`${data.food} 분석 결과: ${data.message}`);
            return;
        }

        analyzedData = {
            food: data.food,
            calories: data.calories,
            carbs: data.carbs,
            protein: data.protein,
            fat: data.fats
        };

        displayFoodData(analyzedData);
    } catch (error) {
        console.error("에러 발생:", error);
        alert("이미지 분석 중 오류가 발생했습니다.");
    }
}

// 선택한 음식 정보 표시
async function showSelectedFood() {
    const foodSelect = document.getElementById("foodSelect");
    const selectedFood = foodSelect.value;

    if (!selectedFood) {
        document.querySelector(".food-details").style.display = "none";
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/food/${selectedFood}`);
        const data = await response.json();

        if (data.message) {
            alert(data.message);
            return;
        }

        analyzedData = {
            food: data.food,
            calories: data.calories,
            carbs: data.carbs,
            protein: data.protein,
            fat: data.fats
        };

        displayFoodData(analyzedData);
    } catch (error) {
        console.error("음식 데이터 가져오기 실패:", error);
        alert("음식 정보를 불러오지 못했습니다.");
    }
}

// 음식 데이터 표시 공통 함수
function displayFoodData(data) {
    document.getElementById("foodName").textContent = data.food;
    document.getElementById("calories").textContent = data.calories;
    document.getElementById("carbs").textContent = data.carbs;
    document.getElementById("protein").textContent = data.protein;
    document.getElementById("fat").textContent = data.fat;
    document.querySelector(".food-details").style.display = "block";
}

// index.html에 데이터 추가
function addToIndex() {
    const meal = getMealFromUrl();

    if (!analyzedData) {
        alert("분석된 데이터가 없습니다.");
        return;
    }

    const currentCalories = parseInt(localStorage.getItem(`${meal}_calories`) || 0);
    const currentCarbs = parseFloat(localStorage.getItem(`${meal}_carbs`) || 0);
    const currentProtein = parseFloat(localStorage.getItem(`${meal}_protein`) || 0);
    const currentFat = parseFloat(localStorage.getItem(`${meal}_fat`) || 0);

    const newCalories = currentCalories + analyzedData.calories;
    const newCarbs = currentCarbs + analyzedData.carbs;
    const newProtein = currentProtein + analyzedData.protein;
    const newFat = currentFat + analyzedData.fat;

    localStorage.setItem(`${meal}_calories`, newCalories);
    localStorage.setItem(`${meal}_carbs`, newCarbs);
    localStorage.setItem(`${meal}_protein`, newProtein);
    localStorage.setItem(`${meal}_fat`, newFat);

    console.log(`Meal: ${meal}, Added: `, analyzedData, `Total: ${newCalories}, ${newCarbs}, ${newProtein}, ${newFat}`);
    window.location.href = "index.html";
}