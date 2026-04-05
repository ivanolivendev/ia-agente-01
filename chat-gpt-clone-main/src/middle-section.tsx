import {
  Center,
  Heading,
  HStack,
  IconButton,
  Input,
  Span,
  VStack,
  Box,
  Text,
  Spinner,
} from '@chakra-ui/react';
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from './components/ui/file-button';
import { InputGroup } from './components/ui/input-group';
import {
  BirthdayIcon,
  ChartIcon,
  CodeIcon,
  EnterIcon,
  IllustrationIcon,
  UploadIcon,
} from './icons/other-icons';
import { useState, useRef, useEffect } from 'react';
import { Button } from './components/ui/button';
import { sendMessage, ChatMessage } from './lib/gemini';

interface PromptButtonProps {
  icon?: React.ReactElement;
  description: string;
}

function PromptButton(props: PromptButtonProps) {
  const { icon, description } = props;
  return (
    <Button variant='outline' borderRadius='full'>
      {icon}
      <Span color='fg.subtle'>{description}</Span>
    </Button>
  );
}

export function MiddleSection() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue;
    setInputValue('');
    
    // Adiciona a mensagem do usuário ao histórico
    const newHistory: ChatMessage[] = [
      ...messages,
      { role: 'user', parts: [{ text: userMessage }] }
    ];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const response = await sendMessage(messages, userMessage);
      setMessages([
        ...newHistory,
        { role: 'model', parts: [{ text: response }] }
      ]);
    } catch (error: any) {
      console.error("Erro ao enviar mensagem:", error);
      setMessages([
        ...newHistory,
        { role: 'model', parts: [{ text: `Erro: ${error.message || "Ocorreu um problema ao falar com o Gemini."}` }] }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Box flex='1' display='flex' flexDirection='column' overflow='hidden' px='4'>
      <Box flex='1' overflowY='auto' py='8'>
        {messages.length === 0 ? (
          <Center h='full'>
            <VStack gap='6'>
              <Heading size='3xl'>What can I help with?</Heading>
              <HStack gap='2'>
                <PromptButton
                  icon={<IllustrationIcon color='green.500' fontSize='lg' />}
                  description='Create image'
                />
                <PromptButton
                  icon={<CodeIcon color='blue.500' fontSize='lg' />}
                  description='Code'
                />
                <PromptButton
                  icon={<ChartIcon color='cyan.400' fontSize='lg' />}
                  description='Analyze data'
                />
                <PromptButton
                  icon={<BirthdayIcon color='cyan.400' fontSize='lg' />}
                  description='Surprise'
                />
                <PromptButton description='More' />
              </HStack>
            </VStack>
          </Center>
        ) : (
          <VStack align='stretch' gap='6' maxW='800px' mx='auto'>
            {messages.map((msg, index) => (
              <Box 
                key={index} 
                alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                bg={msg.role === 'user' ? 'bg.subtle' : 'transparent'}
                p='3'
                borderRadius='xl'
                maxW='85%'
              >
                <Text fontWeight={msg.role === 'user' ? 'bold' : 'normal'}>
                  {msg.parts[0].text}
                </Text>
              </Box>
            ))}
            {isLoading && (
              <Box alignSelf='flex-start' p='3'>
                <Spinner size='sm' />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </VStack>
        )}
      </Box>

      <Box pb='4' pt='2'>
        <Center>
          <InputGroup
            minW={{ base: '100%', md: '768px' }}
            startElement={
              <FileUploadRoot>
                <FileUploadTrigger asChild>
                  <UploadIcon fontSize='2xl' color='fg' />
                </FileUploadTrigger>
                <FileUploadList />
              </FileUploadRoot>
            }
            endElement={
              <IconButton
                fontSize='2xl'
                size='sm'
                borderRadius='full'
                disabled={inputValue.trim() === '' || isLoading}
                onClick={handleSendMessage}
              >
                <EnterIcon fontSize='2xl' />
              </IconButton>
            }
          >
            <Input
              placeholder='Message ChatGPT'
              variant='subtle'
              size='lg'
              borderRadius='3xl'
              value={inputValue}
              onChange={handleInputValue}
              onKeyDown={handleKeyPress}
            />
          </InputGroup>
        </Center>
      </Box>
    </Box>
  );
}
