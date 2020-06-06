import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

import './styles.css';

interface Props {
  showSuccess: boolean;
}

export default function SuccessMessage({ showSuccess }: Props) {
  if (showSuccess) {
    return (
      <div className='bg-black'>
        <FiCheckCircle color='#34CB79' size={38} />
        <p className='success-text'>Cadastro concluído.</p>
      </div>
    );
  } else {
    return <></>;
  }
}
