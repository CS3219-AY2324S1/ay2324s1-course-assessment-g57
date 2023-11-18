/**
 * @file ViewQuestionModal.tsx
 * @desc View Question Modal Component
 *
 * Modal component for viewing a question's details, when provided with a question object.
 * Question object is provided by the QuestionTable component, where it is implemented
 */

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Link,
    Tag,
} from '@chakra-ui/react';

interface ViewQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    question: any;
}

function getComplexityColor(complexity: string) {
    if (complexity === 'easy') {
        return 'green';
    } else if (complexity === 'medium') {
        return 'yellow';
    } else if (complexity === 'hard') {
        return 'red';
    } else {
    }
}

const ViewQuestionModal: React.FC<ViewQuestionModalProps> = ({
    isOpen,
    onClose,
    question,
}) => {
    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                scrollBehavior={'inside'}
                size={'xl'}
                isCentered
                closeOnOverlayClick={true}
            >
                <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(3px)" />
                <ModalContent>
                    <ModalHeader>{question.title}</ModalHeader>
                    <ModalBody>
                        <p>
                            <b>Complexity: </b>
                            <Tag
                                size={'lg'}
                                variant={'solid'}
                                colorScheme={getComplexityColor(
                                    question.complexity
                                )}
                            >
                                {question.complexity}
                            </Tag>
                        </p>
                        <br />
                        <p>
                            <b>Categories:</b>
                            {question?.categories?.map((category: string) => (
                                <span key={category}>
                                    &nbsp;
                                    <Tag>{category}</Tag>
                                </span>
                            ))}
                        </p>
                        <br />
                        <p
                            dangerouslySetInnerHTML={{
                                __html: question.description,
                            }}
                        ></p>
                        <br />
                        <p className="has-text-link">
                            <Link href={question.link}>{question.link}</Link>
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <button
                            className="button is-outlined"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ViewQuestionModal;
