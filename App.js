import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesome } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

//aula do dia 18/03/2026 sobre axios
const api = axios.create({
  baseURL: 'https://aulaAXIOS.com'
});

// ------------ TELA DE LOGIN ------------

function Login({ navigation }) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <FontAwesome name="user-circle" size={80} color="#000000" style={{ marginBottom: 20 }} />
      <Text style={styles.title}>LOGIN!</Text>

      <TextInput style={styles.input} placeholder="LOGIN..." value={login} onChangeText={setLogin} />
      <TextInput style={styles.input} placeholder="SENHA..." secureTextEntry value={senha} onChangeText={setSenha} />

      <TouchableOpacity style={styles.botaoVermelho} onPress={() => navigation.navigate('Lista')}>
        <Text style={styles.textoBotao}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoAzul} onPress={() => navigation.navigate('CadastroUsuario')}>
        <Text style={styles.textoBotao}>CADASTRE-SE</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ------------ LISTA ------------

function Lista({ navigation }) {
  const [contatos, setContatos] = useState([
    { nome: 'Marcos Andrade', telefone: '81 988553424', email: 'marcos@gmail.com' },
    { nome: 'Patrícia Tavares', telefone: '81 998765332', email: 'patricia@gmail.com' },
    { nome: 'Rodrigo Antunes', telefone: '81 987765525', email: 'rodrigo@gmail.com' },
  ]);

  useEffect(() => {
    const carregar = async () => {
      try {
        await api.get('/contatos');
      } catch (e) {
        console.log(e);
      }
    };
    carregar();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>LISTA DE CONTATOS</Text>

        <TouchableOpacity onPress={() => navigation.navigate('CadastroContato', { setContatos, contatos })}>
          <FontAwesome name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {contatos.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              navigation.navigate('AlterarExcluir', {
                contato: item,
                index,
                contatos,
                setContatos,
              })
            }
          >
            <Text style={styles.nome}>{item.nome}</Text>
            <Text>{item.telefone}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ------------ CADASTRO USUÁRIO ------------

function CadastroUsuario({ navigation }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const salvarUsuario = async () => {
    try {
      await api.post('/usuarios', { nome, cpf, email, senha });
      navigation.navigate('Login');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <FontAwesome name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Usuário</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.container}>
        <TextInput style={styles.input} placeholder="nome" onChangeText={setNome} />
        <TextInput style={styles.input} placeholder="cpf" onChangeText={setCpf} />
        <TextInput style={styles.input} placeholder="email" onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="senha" secureTextEntry onChangeText={setSenha} />

        <TouchableOpacity style={styles.botaoAzul} onPress={salvarUsuario}>
          <Text style={styles.textoBotao}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ------------ CADASTRO CONTATO ------------

function CadastroContato({ navigation, route }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  const { contatos, setContatos } = route.params;

  const salvar = async () => {
    const novo = { nome, email, telefone };

    try {
      await api.post('/contatos', novo);
      setContatos([...contatos, novo]);
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>CADASTRO DE CONTATO</Text>

      <TextInput style={styles.input} placeholder="Nome" onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Telefone" onChangeText={setTelefone} />

      <TouchableOpacity style={styles.botaoAzul} onPress={salvar}>
        <Text style={styles.textoBotao}>Salvar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ------------ ALTERAR / EXCLUIR ------------

function AlterarExcluir({ navigation, route }) {
  const { contato, index, contatos, setContatos } = route.params;

  const [nome, setNome] = useState(contato.nome);
  const [email, setEmail] = useState(contato.email);
  const [telefone, setTelefone] = useState(contato.telefone);

  const alterar = async () => {
    const lista = [...contatos];
    lista[index] = { nome, email, telefone };

    try {
      await api.put(`/contatos/${index}`, lista[index]);
      setContatos(lista);
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  const excluir = async () => {
    try {
      await api.delete(`/contatos/${index}`);
      const lista = contatos.filter((_, i) => i !== index);
      setContatos(lista);
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>ALTERAÇÃO / EXCLUSÃO DE CONTATOS</Text>

      <TextInput style={styles.input} value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} />

      <TouchableOpacity style={styles.botaoAzul} onPress={alterar}>
        <Text style={styles.textoBotao}>Alterar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoVermelho} onPress={excluir}>
        <Text style={styles.textoBotao}>Excluir</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ------------ APP ------------

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Lista" component={Lista} />
          <Stack.Screen name="CadastroUsuario" component={CadastroUsuario} />
          <Stack.Screen name="CadastroContato" component={CadastroContato} />
          <Stack.Screen name="AlterarExcluir" component={AlterarExcluir} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


// ------------ STYLE ------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4e4b8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    width: 250,
    height: 40,
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#fff',
  },

  botaoAzul: {
    backgroundColor: '#3b82f6',
    padding: 12,
    width: 250,
    alignItems: 'center',
    marginTop: 10,
  },

  botaoVermelho: {
    backgroundColor: '#b91c1c',
    padding: 12,
    width: 250,
    alignItems: 'center',
    marginTop: 10,
  },

  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },

  header: {
    backgroundColor: '#3b82f6',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  card: {
    padding: 15,
    borderBottomWidth: 1,
  },

  nome: {
    fontWeight: 'bold',
  },
});