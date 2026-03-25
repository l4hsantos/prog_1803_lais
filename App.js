import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Button } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesome } from '@expo/vector-icons';
import { FlatList } from 'react-native';

const Stack = createNativeStackNavigator();
// ------------ LOGIN ------------

function Login({ navigation }) {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function logar() {
    try {
      if (!email || !senha) {
        alert('Preencha email e senha');
        return;
      }

      axios.get(`http://localhost:3000/usuarios?email=${email}&senha=${senha}`)
        .then(function (response) {
          if (response.data.length > 0) {
            navigation.navigate('Lista', { usuario: response.data[0] });
          } else {
            alert('Email ou senha inválidos');
          }
        })
        .catch(function (error) {
          console.log(error);
          alert('Erro ao se conectar a API');
        });

    } catch (error) {
      console.log('Erro ao logar:', error.message);
      alert('Não é possível se conectar a API');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <FontAwesome name="user-circle" size={80} color="#000" style={{ marginBottom: 20 }} />

      <Text style={styles.title}>LOGIN</Text>

      <TextInput
        style={styles.input}
        placeholder="EMAIL..."
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="SENHA..."
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.botaoAzul} onPress={logar}>
        <Text style={styles.textoBotao}>ENTRAR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoVermelho} onPress={() => navigation.navigate('CadastroUsuario')}>
        <Text style={styles.textoBotao}>CADASTRE-SE</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

//------------ LISTA ------------
function Lista({ navigation, route }) {

  const [contatos, setContatos] = useState([]);
  const { usuario } = route.params;

useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    axios.get(`http://localhost:3000/contatos?usuario_id=${usuario.id}`)
      .then(response => setContatos(response.data))
      .catch(error => console.log(error));
  });

  return unsubscribe;
}, [navigation]);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>LISTA DE CONTATOS</Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CadastroContato', { usuario })
          }
        >
          <FontAwesome name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {contatos.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate('AlterarExcluir', {
                contato: item
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

//------------ CADASTRO USUÁRIO ------------

function CadastroUsuario({ navigation }) {

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function salvar() {
    try {
      const usuario = {
        nome,
        cpf,
        email,
        senha
      };

      await axios.post('http://localhost:3000/usuarios', usuario);

      alert('Usuário cadastrado!');
      navigation.goBack();

    } catch (error) {
      console.log(error);
      alert('Erro ao cadastrar usuário');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>

        <Text style={styles.title}>Cadastro de Usuário</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={cpf}
          onChangeText={setCpf}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity style={styles.botaoAzul} onPress={salvar}>
          <Text style={styles.textoBotao}>Salvar</Text>
        </TouchableOpacity>

      </SafeAreaView>
    </SafeAreaView>
  );
}

//------------ CADASTRO CONTATO ------------

function CadastroContato({ navigation, route }) {

  const { usuario } = route.params;

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  const salvar = async () => {
    try {
      const novo = {
        usuario_id: usuario.id,
        nome,
        email,
        telefone,
      };

      await axios.post('http://localhost:3000/contatos', novo);

      alert('Contato cadastrado!');
      navigation.goBack();

    } catch (e) {
      console.log(e);
      alert('Erro ao cadastrar contato');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Contato</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Telefone"
        onChangeText={setTelefone}
      />

      <Button title="Salvar" onPress={salvar} />
    </View>
  );
}

//------------ALTERAR / EXCLUIR ------------

function AlterarExcluir({ navigation, route }) {

  const { contato } = route.params;

  const [nome, setNome] = useState(contato.nome);
  const [email, setEmail] = useState(contato.email);
  const [telefone, setTelefone] = useState(contato.telefone);

  const alterar = async () => {
    try {
      await axios.put(`http://localhost:3000/contatos/${contato.id}`, {
        ...contato,
        nome,
        email,
        telefone,
      });

      alert('Contato atualizado!');
      navigation.goBack();
    } catch (e) {
      console.log(e);
      alert('Erro ao atualizar');
    }
  };

  const excluir = async () => {
    try {
      await axios.delete(`http://localhost:3000/contatos/${contato.id}`);

      alert('Contato excluído!');
      navigation.goBack();
    } catch (e) {
      console.log(e);
      alert('Erro ao excluir');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Contato</Text>

      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        value={telefone}
        onChangeText={setTelefone}
      />

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <Button title="Alterar" onPress={alterar} />
      <Button title="Excluir" onPress={excluir} />
    </View>
  );
}

// ------------ APP ------------

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
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

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
