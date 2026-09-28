import React, { useState } from 'react';

const Access = () => {
  const [email, setEmail] = useState('');
  const [formMsg, setFormMsg] = useState('');
  const [msgType, setMsgType] = useState(''); // 'ok' or 'err'
  const [emailError, setEmailError] = useState(false);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormMsg('');
    setMsgType('');
    setEmailError(false);
    const v = email.trim();
    if (!v) {
      setEmailError(true);
      setMsgType('err');
      setFormMsg('// ERROR: email required');
      return;
    }
    if (!EMAIL_RE.test(v)) {
      setEmailError(true);
      setMsgType('err');
      setFormMsg('// ERROR: invalid email format');
      return;
    }
    setMsgType('ok');
    setFormMsg('// ACCESS REQUESTED — we will be in touch.');
    setEmail('');
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(false);
    setFormMsg('');
    setMsgType('');
  };

  return (
    <section className="section" id="access">
      <div className="container">
        <div className="cta-box reveal">
          <span className="eyebrow">// Open Account</span>
          <h2>Get in before<br />the curve goes vertical.</h2>
          <p className="sub">
            Join the waitlist for early access. Commission-free. No minimums. Real-time execution.
          </p>
          <form className="form" id="waitlistForm" novalidate onSubmit={handleSubmit}>
            <input
              type="email"
              id="email"
              placeholder="you@domain.com"
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
              className={emailError ? 'error' : ''}
            />
            <button type="submit" className="btn btn-primary">
              Request Access
            </button>
          </form>
          <div className={`form-msg ${msgType}`} id="formMsg">
            {formMsg}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Access;