import {Link} from "react-router-dom";
import React from "react";
import styled from "styled-components";

export const NavButtons = () => {
    return <ButtonsContainer>
        <Link to={'/ingresar'}>
            Ingresar
        </Link>
        <Divider/>
        <Link to={'/charts'}>
            Visualizaciones
        </Link>
        <Divider/>
        <Link to={'/reports'}>
            Reportes
        </Link>
    </ButtonsContainer>
}

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: flex-end;
  gap: 10px;
`

const Divider = styled.div`
  border: 0.1px solid var(--secondaryTheme);
  min-height: fit-content;
`
