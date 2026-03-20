import { Button, Center, Text, VStack } from 'native-base';
import { useAuth } from '@providers/auth';

export default function DashboardScreen() {
  const auth = useAuth();

  return (
    <Center flex={1} px={6}>
      <VStack space={4} w="100%" maxW={420}>
        <Text fontSize="2xl" fontWeight="700">
          Dashboard
        </Text>
        <Text color="coolGray.600">
          {auth.user?.email ? `Logado como ${auth.user.email}` : 'Logado'}
        </Text>
        <Button onPress={auth.signOut}>Sair</Button>
      </VStack>
    </Center>
  );
}
