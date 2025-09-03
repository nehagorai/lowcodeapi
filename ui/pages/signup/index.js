
import React, { useState, useEffect } from 'react';
import localstorage from 'local-storage';
import { FaGoogle, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';

import i18nText from '../../static-json/i18n.json';
import fetch from '../../utils/request';
import getBuildContext from '@/utils/get-context';
import SEO from '../../components/seo';
import Layout from '../../studio-components/Layout';

const authProvider = [
  {
    name: "Google",
    href: `auth/google`,
    logo: <FaGoogle className="w-5 h-5" />,
    text: "Sign up with Google"
  }
];

export function Signup({ info = {}, api_endpoints = {}, user, config, providers }) {
  const { name } = info;
  const { ACCOUNT_API, BASE_PATH, BASE_PATH_FALLBACK, ENDPOINT } = api_endpoints;
  const i18n = { ...i18nText.signup };

  const [email, setEmail] = useState('');
  const [lock, setLock] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let freshToken = new URLSearchParams(window.location.search).get('token');
    let token = freshToken || localstorage.get('token');

    if (token) {
      localstorage.set('token', token);
      window.location.href = BASE_PATH || BASE_PATH_FALLBACK;
    }
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLock(true);
    try {
      const data = await fetch(`${ACCOUNT_API}/login`, {
        method: 'POST',
        body: { email },
      });

      if (data && data.message) {
        setMessage(data.message);
      } else {
        setMessage('An error occurred. Please try again.');
      }
    } catch (e) {
      console.error(e);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLock(false);
    }
  };

  const disable_google = !!(config.signup && config.signup.disable_google);
  const disable_email = !!(config.signup && config.signup.disable_email);

  return (
    <Layout info={info} navs={config.navs} user={user} show={false} config={config} hideNav={true} endpoints={api_endpoints}>
      <SEO info={info} scale={true} title={`Signup - ${name}`} ogTitle={`Create account and access 3rd party API's using ${name} common interface`} />
      
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 md:my-12">
          <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
            <h2 className="text-center text-2xl font-extrabold text-gray-900">
              Create your account
            </h2>
            
            {!disable_google && (
              <div>
                {authProvider.map((provider) => (
                  <div key={provider.name}>
                    <a
                      href={`${ENDPOINT}/${provider.href}`}
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {provider.logo}
                      <span className="ml-2">{provider.text}</span>
                    </a>
                  </div>
                ))}
              </div>
            )}

            {!disable_email && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or</span>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={onSubmit}>
                  <div>
                    <label htmlFor="email-address" className="sr-only">Email address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={lock}
                      />
                    </div>
                  </div>

                  {message && (
                    <div className={`text-sm ${message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
                      {message}
                    </div>
                  )}

                  <div>
                    <button
                      type="submit"
                      disabled={lock}
                      className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                        lock ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                      {lock ? 'Sending...' : 'Create Account'}
                    </button>
                  </div>
                </form>
              </>
            )}

            {config.login && (
              <div className="text-sm text-center">
                <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Already have an account? Sign in
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default Signup;

export const getStaticProps = async () => {
  try {
    const contextObj = await getBuildContext();
    const { info, api_endpoints, providers, config } = contextObj;

    return { 
      props: { 
        providers: providers.filter((item) => item.released && !item.testing),
        api_endpoints,
        config,
        info
      } 
    };
  } catch (e) {
    throw e;
  }
}