import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { analyzeImage } from 'services/testService';

const TestScreen: React.FC = ({ navigation }: any) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{ class: string; confidence: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageUploadAndAnalyze = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permissão Negada', 'É necessário permitir acesso à galeria para continuar.');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
  
    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      console.log("selectedImageUri", selectedImageUri);
      
      setImageUri(selectedImageUri);  // Atualiza o estado com a URI da imagem selecionada
      setLoading(true);  // Inicia o estado de loading
  
      try {
        let base64Image = '';
        if (Platform.OS === 'web') {
          const response = await fetch(selectedImageUri);
          const blob = await response.blob();
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            base64Image = reader.result as string;
            processImageAnalysis(base64Image);
          };
        } else {
          base64Image = await FileSystem.readAsStringAsync(selectedImageUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          base64Image = `data:image/jpeg;base64,${base64Image}`;
          processImageAnalysis(base64Image);
        }
      } catch (error: any) {
        console.error('Erro ao analisar imagem:', error); // Log do erro
        Alert.alert('Erro', error.message);
      } finally {
        setLoading(false); // Finaliza o estado de loading
      }
    }
  };
  
  const processImageAnalysis = async (base64Image: string) => {
    const analysisData = await analyzeImage({ image_base64: base64Image });
    setAnalysisResult(analysisData);
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.homeButton}>
        <Text style={styles.homeButtonText}>Voltar para Home</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Faça sua análise</Text>

      <TouchableOpacity onPress={handleImageUploadAndAnalyze} disabled={loading}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <View style={styles.uploadPlaceholder}>
            <Text style={styles.placeholderText}>
              {loading ? 'Analisando...' : 'Toque para fazer upload'}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#9B5DE5" style={{ marginTop: 20 }} />}

      {analysisResult && (
        <>
          <Text style={styles.resultText}>
            Resultado: <Text style={styles.resultHighlight}>{analysisResult.class}</Text>
          </Text>
          <Text style={styles.resultText}>
            Confiança: <Text style={styles.resultHighlight}>{(analysisResult.confidence * 100).toFixed(2)}%</Text>
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D3B66',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  uploadPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#9B5DE5',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E4D77',
  },
  placeholderText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  resultText: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  resultHighlight: {
    color: '#9B5DE5',
    fontWeight: 'bold',
  },
  homeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#9B5DE5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TestScreen;