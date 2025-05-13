import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 기본 컨테이너 스타일
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  settingsButton: {
    padding: 8,
  },
  settingsButtonText: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },

  // 칼로리 카드 스타일
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
  caloriesLeftText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },

  // 영양소 카드 스타일
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

  // 최근 업로드 섹션 스타일
  recentSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#000',
  },

  // 식사 카드 스타일
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

  // 플로팅 버튼 스타일
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
  addButton: {
    backgroundColor: '#2C3E50',
  },
  floatingButtonText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: '600',
  },

  // 모달 공통 스타일
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

  // 입력 필드 스타일
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

  // 버튼 스타일
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
    color: '#222',
    fontWeight: '600',
  },

  // 저장된 음식 목록 스타일
  savedFoodsList: {
    flexGrow: 1,
  },
  savedFoodsListContent: {
    paddingVertical: 10,
  },
  savedFoodItemContainer: {
    marginBottom: 10,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#F8F9FA',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  emptyListContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyListIcon: {
    fontSize: 36,
    marginBottom: 20,
  },
  emptyListText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  emptyListSubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },

  // 영양소 입력 스타일
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

  // 모달 푸터 스타일
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

  // 추가 옵션 모달 스타일
  addOptionsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  addOptionsContainer: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 0,
  },
  addOptionsGrid: {
    flexDirection: 'column',
    width: '100%',
  },
  addOptionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    width: '100%',
  },
  addOptionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  addOptionIcon: {
    fontSize: 20,
  },
  addOptionTextContainer: {
    flex: 1,
  },
  addOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  addOptionSubText: {
    fontSize: 12,
    color: '#6c757d',
  },

  // 알림 모달 스타일
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

  // 음식 분석 모달 스타일
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
    textAlign: 'center',
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

  // 음식 설명 모달 스타일
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
  savedFoodsModal: {
    width: '95%',
    maxHeight: '80%',
    paddingHorizontal: 15,
    paddingTop: 0,
    paddingBottom: 20,
    borderRadius: 20,
  },
  modalBody: {
    padding: 20,
  },
  optionButton: {
    backgroundColor: '#2C3E50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  optionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  errorContainer: {
    padding: 10,
    margin: 10,
    backgroundColor: '#ffebee',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
    fontSize: 14,
  },

  optionModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 0,
    margin: 0,
    overflow: 'hidden',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionIcon: {
    fontSize: 28,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
  },
  optionDesc: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  optionDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginLeft: 80,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
}); 