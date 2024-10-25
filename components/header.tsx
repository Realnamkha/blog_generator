import Link from 'next/link';
import Logo from './logo';
import { Button } from '@/components/ui/button';
import { ModeToggle } from './ModeToggle';

export default function Header() {
  return (
    <header className='bg-white shadow-md'>
      <div className='flex max-w-[90%] mx-auto items-center justify-between py-4'>
        <Link href='/'>
          <Logo />
        </Link>
        <div className='flex items-center space-x-4'>
          <Button 
            size='sm' 
            variant='ghost' 
            className='text-gray-700 hover:text-blue-600 transition duration-200'
          >
            Sign In
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
