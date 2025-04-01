document.addEventListener("DOMContentLoaded", function () {
    updateDate();
    loadCalories();
});

function updateDate() {
    const dateHeader = document.getElementById("date-header");
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}.${today.getDate()}`;
    dateHeader.textContent = formattedDate;
}

function setGoalCalories() {
    Swal.fire({
        title: "목표 칼로리를 입력하세요",
        input: "number",
        inputPlaceholder: "칼로리 입력",
        showCancelButton: true,
        confirmButtonText: "설정",
        cancelButtonText: "취소",
        preConfirm: (value) => {
            if (!value || isNaN(value) || value <= 0) {
                Swal.showValidationMessage("올바른 숫자를 입력하세요.");
                return false;
            }
            return parseInt(value);
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const goalCalories = result.value;
            document.getElementById("goalCalories").textContent = goalCalories;
            document.getElementById("remainingCalories").textContent = goalCalories;
            localStorage.setItem("goalCalories", goalCalories);
            console.log("Goal Calories set:", goalCalories);
        }
    });
}

function addCalories(meal) {
    console.log("Navigating to add_page.html with meal:", meal);
    window.location.href = `add_page.html?meal=${meal}`;
}

function loadCalories() {
    const meals = ["breakfast", "lunch", "dinner", "snack"];
    let totalCalories = 0;
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalFat = 0;

    const savedGoalCalories = parseInt(localStorage.getItem("goalCalories")) || 3000;
    document.getElementById("goalCalories").textContent = savedGoalCalories;

    meals.forEach((meal) => {
        const savedCalories = parseInt(localStorage.getItem(`${meal}_calories`) || 0);
        const savedCarbs = parseFloat(localStorage.getItem(`${meal}_carbs`) || 0);
        const savedProtein = parseFloat(localStorage.getItem(`${meal}_protein`) || 0);
        const savedFat = parseFloat(localStorage.getItem(`${meal}_fat`) || 0);

        if (savedCalories > 0) {
            document.getElementById(meal).textContent = `${savedCalories} kcal`;
            totalCalories += savedCalories;
        }
        totalCarbs += savedCarbs;
        totalProtein += savedProtein;
        totalFat += savedFat;
    });

    // 현재 값 업데이트
    document.getElementById("currentCalories").textContent = totalCalories;
    document.getElementById("remainingCalories").textContent = Math.max(savedGoalCalories - totalCalories, 0);
    document.getElementById("carbs").textContent = totalCarbs.toFixed(1);
    document.getElementById("protein").textContent = totalProtein.toFixed(1);
    document.getElementById("fat").textContent = totalFat.toFixed(1);

    console.log("Loaded: ", { totalCalories, totalCarbs, totalProtein, totalFat });
}

function resetCalories() {
    Swal.fire({
        title: "칼로리를 초기화하시겠습니까?",
        text: "모든 식사의 칼로리가 0으로 설정됩니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "초기화",
        cancelButtonText: "취소"
    }).then((result) => {
        if (result.isConfirmed) {
            const meals = ["breakfast", "lunch", "dinner", "snack"];
            meals.forEach((meal) => {
                localStorage.setItem(`${meal}_calories`, 0);
                localStorage.setItem(`${meal}_carbs`, 0);
                localStorage.setItem(`${meal}_protein`, 0);
                localStorage.setItem(`${meal}_fat`, 0);
                document.getElementById(meal).textContent = "0 kcal";
            });

            const savedGoalCalories = parseInt(localStorage.getItem("goalCalories")) || 3000;
            document.getElementById("currentCalories").textContent = 0;
            document.getElementById("remainingCalories").textContent = savedGoalCalories;
            document.getElementById("carbs").textContent = "0";
            document.getElementById("protein").textContent = "0";
            document.getElementById("fat").textContent = "0";

            console.log("Calories reset to 0");
            Swal.fire("초기화 완료", "칼로리가 초기화되었습니다.", "success");
        }
    });
}