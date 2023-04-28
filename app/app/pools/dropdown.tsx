"use cilent"
import { STATES } from '@/hooks/usePool'
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";

export default function Dropdown({ filterState }: { filterState: (state: number) => void }) {
    const [state, setState] = useState(4);

    return (
        <Menu>
            <Menu.Button>
                <span className="flex flex-row items-center">
                    <span>{STATES[state].toLocaleLowerCase()}</span>
                    <FontAwesomeIcon
                        icon={faSortDown}
                        className="pl-1 pb-1 hover:cursor-pointer"
                    />
                </span>
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute rounded-sm bg-black flex flex-col border border-solid border-gray-500 p-2 opacity-90 focus:outline-none">
                    {STATES.map((state, index) => (
                        <Menu.Item key={index}>
                            <span onClick={() => {
                                setState(index)
                                filterState(index)
                            }}>
                                {state.toLocaleLowerCase()}
                            </span>
                        </Menu.Item>
                    ))}
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
