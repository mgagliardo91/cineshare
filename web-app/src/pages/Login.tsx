import React, { useState, useCallback } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useSignInMutation } from '../api/generated/authentication';
import './Login.scss';

const Login = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [signIn, { data, loading, error }] = useSignInMutation();

  const onSignIn = useCallback(
    async (email: string, password: string) => {
      await signIn({
        variables: {
          email,
          password,
        },
      });
    },
    [signIn]
  );

  return (
    <Form className="login-form">
      <div className="text-center my-5">
        <h1 className="mb-4">CineShare</h1>
        <p>Enter your login information below to access your account.</p>
      </div>
      <Form.Group controlId="cineshareEmail">
        <Form.Control
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Email"
          autoComplete="off"
        />
      </Form.Group>
      <Form.Group controlId="cinesharePassword">
        <Form.Control
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          autoComplete="new-password"
        />
      </Form.Group>
      <Form.Group>
        <Form.Check type="checkbox" label="Remember me" id="remember-me" />
      </Form.Group>
      <Button
        disabled={!email || !password}
        block
        size="lg"
        onClick={() => !loading && onSignIn(email!, password!)}
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>
    </Form>
  );
};

export default Login;
