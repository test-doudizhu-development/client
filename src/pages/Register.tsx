import { Button, ButtonGroup, Heading, SimpleGrid, Text, useToast, VStack } from '@chakra-ui/react'
import { Form, Formik, FormikProps, FormikValues } from 'formik'
import React from 'react'
import { AiOutlineUser } from 'react-icons/ai'
import { GrUndo } from 'react-icons/gr'
import { Link, useNavigate } from 'react-router-dom'
import { LineBackground } from '../components/Backgrounds'
import { EmailField, NameField, PasswordField } from '../forms/AuthFields'
import { baseSchema } from '../forms/Schemas'
import useApi from "../components/useApi";

export default function Register() {
    const { post, response } = useApi('/user/register')
    const navigate = useNavigate()
    const toast = useToast()
    const schema = baseSchema.pick(['name', 'username', 'password', 'repeatPassword'])

    const register = (values: FormikValues) => post(values).then(data =>
        response.ok ? navigate(`/verify`) : toast({ title: data.message, status: 'error' }))

    return (
        <VStack minH='100vh' minW='fit-content' p={4} spacing={12} position='relative' justify='center'>
        <VStack>
            <Heading>Register</Heading>
        <Text textAlign='center' w='md' color='gray.600'>
        You need to register in order to create matching forms.
        Please provide your contact information below.
    </Text>
    </VStack>
    <Formik initialValues={schema.getDefaultFromShape()} validationSchema={schema} onSubmit={register}>
        {(formProps: FormikProps<any>) =>
    <VStack align='end' as={Form} spacing={10}>
    <SimpleGrid minW='max-content' spacing={8} columns={1} bg='white' boxShadow='lg' rounded='3xl' borderWidth={1} p={10} pt={6}>
    <NameField icon={AiOutlineUser} />
    <NameField fieldName='username' icon={AiOutlineUser} />
    <PasswordField/>
    <PasswordField repeat/>
    </SimpleGrid>
    <ButtonGroup>
    <Button variant='round' type='submit' isLoading={formProps.isSubmitting} isDisabled={!formProps.isValid}>
    Register
    </Button>
    </ButtonGroup>
    </VStack>}
    </Formik>
    <Button as={Link} to='/' leftIcon={<GrUndo />} variant='ghost'>Back</Button>
        <LineBackground transform='scaleY(-1)' viewBox='-1400 0 1500 500' />
        </VStack>
)
}