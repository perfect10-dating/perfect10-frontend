import styled from 'styled-components/macro'

export const LoginBox = styled.div`
  padding: 40px;
  text-align: center;
  color: #ffffff;
  transition: all 0.5s;
  width: 100%;
`

const StyledBrand = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const Logo = styled.div`
  height: 60px;
  width: 130px;
  margin-bottom: -20px;
  background-image: ${({ theme }) => theme.inputLogo || 'url("/img/storyforms_logo_fox.png")'};
  filter: ${({ theme }) => theme.inputLogoFilter};
  background-size: cover;
  background-position: center;
`

export const Name = styled.p`
  margin: 10px auto 20px auto;
  letter-spacing: 2px;
  background-color: ${({ theme }) => theme.inputHeader || '#1b113f'};
  background-size: 100%;
  background-clip: text;
  background-repeat: repeat;
  font-size: 30px;
  font-family: Avenir;
  font-weight: 500;

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
`

export const Brand = () => (
    <StyledBrand>
        <Logo />
        <Name>Storyforms</Name>
    </StyledBrand>
)

export const Subheader = styled.div`
  color: #ffffff;
  font-size: 16px;
  user-select: none;
  margin: 0 30px;
  text-align: left;
`

export const Input = styled.input<{ status: string }>`
  display: block;
  height: 32px;
  margin: 30px auto;
  width: 250px;
  font-size: 18px;
  background-color: rgb(194, 213, 242);
  color: ${({ theme }) => theme.inputActive};
  border: none;
  border-radius: 10px;
  border-bottom: ${({ theme, status }) =>
    status === 'valid'
        ? '2px solid #00ba00'
        : status === 'entering'
            ? '2px solid #ff6400'
            : `2px solid ${theme.inputPlaceholder}`};
  outline: none;
  padding: 0;
  padding-left: 10px;
  transition: 0.2s all;

  &::placeholder {
    color: ${({ theme }) => theme.inputPlaceholder};
  }

  &:focus {
    border-bottom: ${({ theme, status }) =>
    status === 'valid'
        ? '2px solid #00ba00'
        : status === 'entering'
            ? '2px solid #ff6400'
            : `2px solid ${theme.inputActive} `};
  }
`

export const InputSubAction = styled.p`
  width: 250px;
  text-align: left;
  margin: -20px auto 20px auto;
  font-size: 13px;
  cursor: pointer;
  color: ${({ theme }) => theme.subaction};
  user-select: none;
  font-weight: 500;
  transition: 0.2s all;

  &:hover {
    color: ${({ theme }) => theme.subactionFocus};
  }
`

export const Submit = styled.input`
  display: block;
  position: relative;
  margin: 40px auto 0 auto;
  height: 32px;
  min-width: 100px;
  font-size: 14px;
  color: ${({ theme }) => theme.submitButtonText};
  font-weight: 800;
  background: ${({ theme }) => theme.submitButton};
  border: none;
  cursor: pointer;
  outline: none;
  -webkit-appearance: none;
  padding: 0px 10px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.submitButtonHover};
  }
`

export const Seperation = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.inputPlaceholder};
  padding: 10px 0;
`

export const BottomActionText = styled.div`
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  color: ${({ theme }) => theme.subaction};
  user-select: none;
  transition: 0.2s all;

  &:hover {
    color: ${({ theme }) => theme.subactionFocus};
  }
`