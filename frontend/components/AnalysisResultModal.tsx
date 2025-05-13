import React, { useState, useEffect } from 'react';
import { Modal, View, Image, ScrollView, TextInput, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from './ThemedText';
import { styles as globalStyles } from '../styles/index';
import { AddOptionsModal } from './AddOptionsModal';
import * as ImagePicker from 'expo-image-picker';
import { DescribeFoodModal } from './DescribeFoodModal';

interface AnalysisResultModalProps {
  visible: boolean;
  imageUri?: string;
  initialName: string;
  initialCalories: number;
  initialProtein: number;
  initialCarbs: number;
  initialFats: number;
  initialGrams: number;
  onClose: () => void;
  onSave: (data: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    grams: number;
    imageUri?: string;
  }) => void;
}

export const AnalysisResultModal: React.FC<AnalysisResultModalProps> = ({
  visible,
  imageUri: initialImageUri,
  initialName,
  initialCalories,
  initialProtein,
  initialCarbs,
  initialFats,
  initialGrams,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(initialName);
  const [calories, setCalories] = useState(initialCalories);
  const [protein, setProtein] = useState(initialProtein);
  const [carbs, setCarbs] = useState(initialCarbs);
  const [fats, setFats] = useState(initialFats);
  const [grams, setGrams] = useState(initialGrams);
  const [imageUri, setImageUri] = useState<string | undefined>(initialImageUri);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showDescribeModal, setShowDescribeModal] = useState(false);
  const [baseCalories, setBaseCalories] = useState(initialCalories);
  const [baseProtein, setBaseProtein] = useState(initialProtein);
  const [baseCarbs, setBaseCarbs] = useState(initialCarbs);
  const [baseFats, setBaseFats] = useState(initialFats);
  const [baseGrams, setBaseGrams] = useState(initialGrams);

  useEffect(() => {
    setImageUri(initialImageUri);
    setBaseCalories(initialCalories);
    setBaseProtein(initialProtein);
    setBaseCarbs(initialCarbs);
    setBaseFats(initialFats);
    setBaseGrams(initialGrams);
  }, [initialImageUri, initialCalories, initialProtein, initialCarbs, initialFats, initialGrams]);

  // 수량(grams)이 변경될 때 칼로리와 영양성분을 비례하여 업데이트
  useEffect(() => {
    const ratio = grams / baseGrams;
    setCalories(Math.round(baseCalories * ratio));
    setProtein(Math.round(baseProtein * ratio));
    setCarbs(Math.round(baseCarbs * ratio));
    setFats(Math.round(baseFats * ratio));
  }, [grams, baseGrams, baseCalories, baseProtein, baseCarbs, baseFats]);

  const handleSave = () => {
    onSave({
      name,
      calories,
      protein,
      carbs,
      fat: fats,
      grams,
      imageUri,
    });
  };

  const increment = () => setGrams((g) => g + 1);
  const decrement = () => setGrams((g) => (g > 1 ? g - 1 : 1));

  // 사진 선택 핸들러
  const handleCameraPress = async () => {
    setShowOptionsModal(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };
  const handleGalleryPress = async () => {
    setShowOptionsModal(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleDescribeSave = () => {
    setShowDescribeModal(false);
    // DescribeFoodModal에서 수정된 값으로 기준값도 갱신
    setBaseCalories(calories);
    setBaseProtein(protein);
    setBaseCarbs(carbs);
    setBaseFats(fats);
    setBaseGrams(grams);
    // handleSave() 호출하지 않음
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={globalStyles.modalOverlay}>
          <View style={[globalStyles.modalContent, { padding: 0, borderRadius: 20, overflow: 'hidden' }]}> 
            {imageUri && (
              <Image source={{ uri: imageUri }} style={{ width: '100%', height: 220, borderTopLeftRadius: 20, borderTopRightRadius: 20 }} resizeMode="cover" />
            )}
            <View style={{ padding: 24 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#222' }}>{name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fafafa', borderRadius: 16, paddingHorizontal: 8, paddingVertical: 4 }}>
                  <TouchableOpacity onPress={decrement} style={{ padding: 6 }}>
                    <Text style={{ fontSize: 22, color: '#888' }}>-</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={{ fontSize: 18, marginHorizontal: 8, width: 50, textAlign: 'center' }}
                    value={grams.toString()}
                    onChangeText={(text) => setGrams(Number(text) || 0)}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity onPress={increment} style={{ padding: 6 }}>
                    <Text style={{ fontSize: 22, color: '#888' }}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
                <Text style={{ fontSize: 20, marginRight: 6 }}>🔥</Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222' }}>{calories}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{ fontSize: 28, marginBottom: 2 }}>🥩</Text>
                  <Text style={{ color: '#888', fontSize: 14 }}>Protein</Text>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{protein}g</Text>
                </View>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{ fontSize: 28, marginBottom: 2 }}>🌾</Text>
                  <Text style={{ color: '#888', fontSize: 14 }}>Carbs</Text>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{carbs}g</Text>
                </View>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{ fontSize: 28, marginBottom: 2 }}>🥑</Text>
                  <Text style={{ color: '#888', fontSize: 14 }}>Fats</Text>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{fats}g</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: '#f5f5f5', borderRadius: 12, padding: 18, alignItems: 'center' }}
                  onPress={() => setShowDescribeModal(true)}
                >
                  <Text style={{ color: '#222', fontSize: 16 }}>Fix Results</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: '#000', borderRadius: 12, padding: 18, alignItems: 'center' }}
                  onPress={handleSave}
                >
                  <Text style={{ color: '#fff', fontSize: 16 }}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <AddOptionsModal
        visible={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        onCameraPress={handleCameraPress}
        onGalleryPress={handleGalleryPress}
        onDescribePress={() => setShowOptionsModal(false)}
        onSavedFoodsPress={() => setShowOptionsModal(false)}
      />
      <DescribeFoodModal
        visible={showDescribeModal}
        onClose={() => setShowDescribeModal(false)}
        onSave={handleDescribeSave}
        foodName={name}
        setFoodName={setName}
        foodCalories={calories.toString()}
        setFoodCalories={(text) => setCalories(Number(text) || 0)}
        foodProtein={protein.toString()}
        setFoodProtein={(text) => setProtein(Number(text) || 0)}
        foodCarbs={carbs.toString()}
        setFoodCarbs={(text) => setCarbs(Number(text) || 0)}
        foodFat={fats.toString()}
        setFoodFat={(text) => setFats(Number(text) || 0)}
        foodGrams={grams.toString()}
        setFoodGrams={(text) => setGrams(Number(text) || 0)}
      />
    </>
  );
}; 