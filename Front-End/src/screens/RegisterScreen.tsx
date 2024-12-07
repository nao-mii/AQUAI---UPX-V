import Button from "components/Button";
import Input from "components/Input";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { register } from "services/authService";

const RegisterScreen: React.FC = ({ navigation }: any) => {
  const [nome, setNome] = useState<string>("");
  const [dataNascimento, setDataNascimento] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async () => {
    if (!nome || !dataNascimento || !email || !password || !confirmPassword) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }
  
    try {
      setLoading(true);
  
      await register(nome, email, password, dataNascimento); // Enviando todos os dados para o backend
      Alert.alert("Sucesso", "Registro bem-sucedido!");
      navigation.navigate("Home"); // Altere para o nome correto da rota
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar</Text>

      <Input placeholder="Nome completo" value={nome} onChangeText={setNome} />
      <Input
        placeholder="Data de nascimento (YYYY-MM-DD)"
        value={dataNascimento}
        onChangeText={setDataNascimento}
      />
      <Input
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <Input
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Input
        placeholder="Confirme sua senha"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button text="Registrar" onPress={handleRegister} loading={loading} />

      <Button
        text="Já tem uma conta? Faça login"
        onPress={() => navigation.navigate("Login")}
        style={{ backgroundColor: "grey", marginTop: 15 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#0D3B66",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    backgroundColor: "transparent",
    borderColor: "#A9A9A9",
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    height: 50,
  },
  passwordHint: {
    fontSize: 12,
    color: "#A9A9A9",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#9B5DE5",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: "#6A4CA5",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLink: {
    color: "#9B5DE5",
    fontSize: 14,
    marginTop: 20,
  },
});


export default RegisterScreen;
