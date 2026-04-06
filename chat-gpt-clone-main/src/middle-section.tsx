import {
  Center,
  Heading,
  IconButton,
  Input,
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
  EnterIcon,
  UploadIcon,
} from './icons/other-icons';
import { useState, useRef, useEffect } from 'react';
import { sendMessage, ChatMessage } from './lib/gemini';
import ReactMarkdown from 'react-markdown';

/**
 * COMPONENTE DE CHAT PARA PORTFÓLIO (Refatorado conforme Dica 1)
 * Este componente foi desenhado para ser inserido em qualquer container
 * e gerenciar seu próprio scroll e layout interno de forma robusta.
 */
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
    <Box 
      h='full' 
      w='full' 
      display='flex' 
      flexDirection='column' 
      overflow='hidden' 
      bg='bg.canvas'
      position="relative"
    >
      {/* Container de Mensagens com Scroll Interno Independente */}
      <Box 
        flex='1' 
        overflowY='auto' 
        px={{ base: '4', md: '8' }}
        py='8'
        css={{
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: '#cbd5e0', borderRadius: '10px' },
        }}
      >
        {messages.length === 0 ? (
          <Center h='full'>
            <VStack gap='4' textAlign='center' maxW="500px">
              <Heading size='3xl' fontWeight="bold" letterSpacing="tight">
                Assistente do Ivan
              </Heading>
              <Text color='fg.muted' fontSize='lg'>
                Olá! Sou a IA treinada com o currículo do Ivan Cavalcante. 
                Como posso te ajudar hoje?
              </Text>
            </VStack>
          </Center>
        ) : (
          <VStack align='stretch' gap='8' maxW='800px' mx='auto'>
            {messages.map((msg, index) => (
              <Box 
                key={index} 
                alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                bg={msg.role === 'user' ? 'bg.subtle' : 'transparent'}
                p={msg.role === 'user' ? '4' : '0'}
                borderRadius='2xl'
                maxW='90%'
                border={msg.role === 'model' ? 'none' : '1px solid'}
                borderColor='border.subtle'
              >
                {msg.role === 'user' ? (
                  <Text fontWeight="medium">{msg.parts[0].text}</Text>
                ) : (
                  <Box 
                    className="markdown-body"
                    fontSize="md"
                    lineHeight="tall"
                    css={{
                      'p': { marginBottom: '1rem' },
                      'ul, ol': { marginLeft: '1.5rem', marginBottom: '1rem' },
                      'li': { marginBottom: '0.5rem' },
                      'strong': { color: 'inherit', fontWeight: 'bold' },
                      'h1, h2, h3': { marginTop: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }
                    }}
                  >
                    <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                  </Box>
                )}
              </Box>
            ))}
            {isLoading && (
              <Box alignSelf='flex-start' p='2'>
                <Spinner size='sm' color="blue.500" />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </VStack>
        )}
      </Box>

      {/* Área de Input Fixa na Base */}
      <Box pb='8' pt='4' px='4' bg='bg.canvas' borderTop="1px solid" borderColor="border.subtle">
        <Center>
          <InputGroup
            w='full'
            maxW='768px'
            startElement={
              <FileUploadRoot>
                <FileUploadTrigger asChild>
                  <UploadIcon fontSize='2xl' color='fg.muted' cursor='pointer' _hover={{ color: 'fg' }} />
                </FileUploadTrigger>
                <FileUploadList />
              </FileUploadRoot>
            }
            endElement={
              <IconButton
                variant="ghost"
                size='sm'
                borderRadius='full'
                disabled={inputValue.trim() === '' || isLoading}
                onClick={handleSendMessage}
                _hover={{ bg: 'bg.subtle' }}
              >
                <EnterIcon fontSize='2xl' />
              </IconButton>
            }
          >
            <Input
              placeholder='Pergunte algo sobre a carreira do Ivan...'
              variant='subtle'
              size='lg'
              borderRadius='2xl'
              py="6"
              value={inputValue}
              onChange={handleInputValue}
              onKeyDown={handleKeyPress}
              _focus={{ borderColor: 'blue.500', bg: 'bg.subtle' }}
            />
          </InputGroup>
        </Center>
      </Box>
    </Box>
  );
}
